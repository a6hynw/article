from pathlib import Path
from flask import Flask, render_template, request, jsonify
import pandas as pd
import traceback
from flask_cors import CORS
ROOT_DIR = Path(__file__).resolve().parent


def import_recommender():
    # Try importing the recommender in a couple of common ways so the app
    # can be run from the repo root or when src is on sys.path.
    try:
        from src.recommendation.tfidf_recommender import TFIDFRecommender
        return TFIDFRecommender
    except Exception:
        try:
            from recommendation.tfidf_recommender import TFIDFRecommender
            return TFIDFRecommender
        except Exception:
            raise


app = Flask(__name__)
CORS(app)

# Global (lazy) model and data holders
RECOMMENDER = None
ARTICLES_DF = None


class SimpleRecommender:
    """Lightweight fallback recommender used when the TF-IDF model
    can't be imported or fails to load. Returns same-category articles
    or a simple content-based search result so the frontend still shows
    recommendation cards.
    """
    def __init__(self, articles_df=None):
        self.articles_df = articles_df

    def fit(self, articles_df):
        self.articles_df = articles_df
        return self

    def get_recommendations(self, article_id, top_n=10):
        if self.articles_df is None:
            return []

        try:
            base = self.articles_df[self.articles_df['article_id'] == article_id]
            if base.empty:
                return []
            base_content = base.iloc[0].get('content', '')
            base_words = set(base_content.lower().split()) if base_content else set()
        except Exception:
            return []

        # Get all other articles
        candidates = self.articles_df[self.articles_df['article_id'] != article_id].copy()

        # Compute similarity scores
        similarities = []
        for _, row in candidates.iterrows():
            cand_content = row.get('content', '')
            cand_words = set(cand_content.lower().split()) if cand_content else set()
            union = base_words | cand_words
            if union:
                sim = len(base_words & cand_words) / len(union)
            else:
                sim = 0.0
            similarities.append((sim, row))

        # Sort by similarity descending
        similarities.sort(key=lambda x: x[0], reverse=True)

        # Take top_n
        top_candidates = similarities[:top_n]

        results = []
        for sim, row in top_candidates:
            results.append({
                'article_id': int(row['article_id']),
                'similarity_score': sim,
                'content_preview': str(row.get('content', ''))[:200] + '...',
                'summary': row.get('summary', 'Summary not available')
            })

        return results

    def search_by_text(self, text, top_n=10):
        if self.articles_df is None or not text:
            return []

        matches = self.articles_df[
            self.articles_df['content'].str.contains(text, case=False, na=False) |
            self.articles_df['category'].str.contains(text, case=False, na=False)
        ].head(top_n)

        results = []
        for _, row in matches.iterrows():
            results.append({
                'article_id': int(row['article_id']),
                'similarity_score': 0.5,
                'content_preview': str(row.get('content', ''))[:200] + '...',
                'summary': row.get('summary', 'Summary not available')
            })

        return results


def load_data_and_model():
    global RECOMMENDER, ARTICLES_DF

    if RECOMMENDER is not None and ARTICLES_DF is not None:
        return
    # Load data first (this should work even if ML dependencies are missing)
    data_path = ROOT_DIR / "data" / "processed" / "articles_processed.csv"
    if not data_path.exists():
        raise FileNotFoundError(f"Processed data not found at: {data_path}")

    if ARTICLES_DF is None:
        ARTICLES_DF = pd.read_csv(data_path)
        # Ensure article_id is int for consistent comparisons
        ARTICLES_DF['article_id'] = ARTICLES_DF['article_id'].astype(int)

    # Then try to import/fit the recommender; if it fails, leave RECOMMENDER as None
    if RECOMMENDER is None:
        try:
            TFIDFRecommender = import_recommender()
            RECOMMENDER = TFIDFRecommender()
            RECOMMENDER.fit(ARTICLES_DF)
        except Exception as e:
            # If the TF-IDF recommender can't be imported or fails to fit,
            # fall back to a lightweight recommender so the frontend still
            # receives recommendation cards.
            print(f"Warning: TF-IDF recommender unavailable, using fallback. Error: {e}")
            RECOMMENDER = SimpleRecommender(ARTICLES_DF).fit(ARTICLES_DF)


def load_data():
    """Load only the articles dataframe without importing ML dependencies."""
    global ARTICLES_DF
    if ARTICLES_DF is not None:
        return
    data_path = ROOT_DIR / "data" / "processed" / "articles_processed.csv"
    if not data_path.exists():
        raise FileNotFoundError(f"Processed data not found at: {data_path}")
    ARTICLES_DF = pd.read_csv(data_path)


@app.route("/", methods=["GET", "POST"])
def index():
    error = None
    results = None
    query = None
    top_n = 5

    # Lazily load data and model together; load_data_and_model() already
    # calls load_data() internally so we only need one call here.
    try:
        load_data_and_model()
    except Exception as e:
        error = f"Load error: {e}"
        error += "\n" + traceback.format_exc()


    if request.method == "POST" and error is None:
        query = request.form.get("query", "").strip()
        top_n = int(request.form.get("top_n", 5))

        # If the input looks like an integer, try article_id recommendation
        if query.isdigit():
            article_id = int(query)
            results = RECOMMENDER.get_recommendations(article_id, top_n=top_n)
        else:
            # Treat input as search text
            results = RECOMMENDER.search_by_text(query, top_n=top_n)

    # Provide a small sample of article IDs for convenience if data is available
    sample_ids = []
    if ARTICLES_DF is not None and not ARTICLES_DF.empty:
        sample_ids = ARTICLES_DF["article_id"].astype(int).head(10).tolist()

    return render_template(
        "index.html",
        error=error,
        results=results,
        query=query,
        sample_ids=sample_ids,
        top_n=top_n,
    )


@app.route("/api/articles", methods=["GET"])
def get_articles():
    """Get all articles or a sample of them"""
    try:
        load_data()
        
        # DEBUG: Print available categories to console
        print(f"Loaded DataFrame categories: {ARTICLES_DF['category'].unique()}")
        print(f"Total rows: {len(ARTICLES_DF)}")

        limit = request.args.get('limit', default=10, type=int)
        category_filter = request.args.get('category')
        
        filtered_df = ARTICLES_DF
        
        if category_filter:
            print(f"Filtering by category: {category_filter}")
            # Filter by category (case-insensitive). If a `labels` column exists, check it too.
            cf = category_filter.lower()
            if 'labels' in ARTICLES_DF.columns:
                # match if any label contains the filter token
                filtered_df = ARTICLES_DF[
                    ARTICLES_DF['labels'].str.lower().str.contains(cf, na=False) |
                    ARTICLES_DF['category'].str.lower().eq(cf)
                ]
            else:
                filtered_df = ARTICLES_DF[
                    ARTICLES_DF['category'].str.lower() == cf
                ]
            
        if 'article_id' in filtered_df.columns:
            filtered_df = filtered_df.sort_values(by='article_id', ascending=False)
            
        if limit and limit > 0:
            articles = filtered_df.head(limit).copy()
        else:
            articles = filtered_df.copy()
        
        # Add derived fields for frontend
        articles['id'] = articles['article_id'].astype(int)
        # Guard against NaN content before chaining string operations
        safe_content = articles['content'].fillna('')
        # Prefer explicit title column; fall back to first line of content
        if 'title' in articles.columns:
            articles['title'] = articles['title'].fillna('').where(
                articles['title'].fillna('').str.strip() != '', 
                safe_content.str.split('\n').str[0].str[:80]
            )
        else:
            articles['title'] = safe_content.str.split('\n').str[0].str[:80]
        articles['imageUrl'] = 'https://images.unsplash.com/photo-1617957796155-72d8717ac882?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        articles['author'] = 'BBC News'
        # Ensure category is present (it should be)
        if 'category' not in articles.columns:
            articles['category'] = 'general'

        articles['excerpt'] = safe_content.str[:150]
        
        # Prefer to include labels in the API output when available
        out_cols = ['id', 'article_id', 'title', 'content', 'summary', 'imageUrl', 'author', 'category', 'excerpt']
        if 'labels' in articles.columns:
            out_cols.append('labels')
        result = articles[out_cols].to_dict(orient='records')
        return jsonify(result)
    except Exception as e:
        print(f"Error in get_articles: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/article/<article_id>", methods=["GET"])
def get_article(article_id):
    """Get full details of a specific article.

    Accepts numeric article IDs even if they appear as floats/strings
    in the incoming URL (e.g. `/api/article/0.0` or `/api/article/0`).
    """
    try:
        load_data()

        # Try to coerce article_id to an integer indexable value.
        # int(float(x)) handles '0', '0.0', '42.0', etc. uniformly.
        try:
            article_id_int = int(float(article_id))
        except (ValueError, TypeError):
            # fallback: compare as raw string
            article_id_int = None

        if article_id_int is not None:
            article = ARTICLES_DF[ARTICLES_DF['article_id'] == article_id_int]
        else:
            article = ARTICLES_DF[ARTICLES_DF['article_id'].astype(str) == str(article_id)]

        if article.empty:
            return jsonify({"error": "Article not found"}), 404
        
        article_data = article.to_dict(orient='records')[0]

        # Add derived fields for frontend
        article_data['id'] = article_data.get('article_id')
        article_data['title'] = article_data.get('content', '').split('\n')[0][:100]
        article_data['imageUrl'] = 'https://images.unsplash.com/photo-1504711331062-f86b0b51b552?w=800&h=400&fit=crop'
        article_data['author'] = 'BBC News'
        # article above is a DataFrame slice; prefer the already-extracted value
        article_data['category'] = article_data.get('category', 'general')
        
        return jsonify(article_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/recommendations/<article_id>", methods=["GET"])
def get_recommendations(article_id):
    """Get recommendations for a specific article. Accept non-integer URL ids and coerce."""
    try:
        load_data_and_model()
        top_n = request.args.get('top_n', default=6, type=int)

        # coerce similar to get_article
        try:
            article_id_int = int(float(article_id))
        except Exception:
            article_id_int = None

        if article_id_int is None:
            return jsonify({"error": "Invalid article id"}), 400

        results = RECOMMENDER.get_recommendations(article_id_int, top_n=top_n)

        # Enhance results with additional fields for frontend; be defensive
        enhanced_results = []
        for rec in results:
            # ensure rec is a dict
            if not isinstance(rec, dict):
                continue

            # prefer explicit article_id field but accept id; normalise to int
            raw_id = rec.get('article_id') or rec.get('id')
            try:
                rec_article_id = int(raw_id) if raw_id is not None else None
            except (ValueError, TypeError):
                rec_article_id = None
            rec['article_id'] = rec_article_id
            rec['id'] = rec_article_id

            # Cast the DataFrame column to int for a reliable comparison
            if rec_article_id is not None:
                article_idx = ARTICLES_DF[
                    ARTICLES_DF['article_id'].astype(int) == rec_article_id
                ].index
            else:
                article_idx = []

            if len(article_idx) > 0:
                article = ARTICLES_DF.iloc[article_idx[0]]
                raw_content = article['content'] if 'content' in article.index else None
                safe_content = str(raw_content) if (raw_content is not None and pd.notna(raw_content)) else ''
                rec['title'] = str(article.get('title', safe_content.split('\n')[0][:100] if safe_content else 'Untitled'))
                rec['imageUrl'] = 'https://images.unsplash.com/photo-1617957743103-310accdfb999?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                rec['author'] = 'BBC News'
                raw_cat = article['category'] if 'category' in article.index else None
                rec['category'] = str(raw_cat) if (raw_cat is not None and pd.notna(raw_cat)) else 'general'
                rec['excerpt'] = safe_content[:150] if safe_content else ''
                rec['content'] = safe_content
            else:
                # If article not found in DF, use defaults or skip; here we use defaults to avoid breaking cards
                rec['title'] = rec.get('title', 'Untitled')
                rec['imageUrl'] = rec.get('imageUrl', 'https://images.unsplash.com/photo-1617957743103-310accdfb999?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
                rec['author'] = rec.get('author', 'BBC News')
                rec['category'] = rec.get('category', 'general')
                rec['excerpt'] = rec.get('excerpt', rec.get('content_preview', ''))
                rec['content'] = rec.get('content', '')

            enhanced_results.append(rec)
        
        return jsonify(enhanced_results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/search", methods=["POST"])
def search_articles():
    """Search articles by text"""
    try:
        load_data()
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON body"}), 400
        query = data.get('query', '').strip()
        top_n = int(data.get('top_n', 5))

        if not query:
            return jsonify({"error": "Query is required"}), 400

        print(f"Searching for: {query}")
        
        mask = ARTICLES_DF['content'].str.contains(query, case=False, na=False) | \
               ARTICLES_DF['category'].str.contains(query, case=False, na=False)
        
        if 'title' in ARTICLES_DF.columns:
            mask |= ARTICLES_DF['title'].str.contains(query, case=False, na=False)
        if 'summary' in ARTICLES_DF.columns:
            mask |= ARTICLES_DF['summary'].str.contains(query, case=False, na=False)
            
        raw_matches = ARTICLES_DF[mask]
        
        if 'article_id' in raw_matches.columns:
            raw_matches = raw_matches.sort_values(by='article_id', ascending=False)
            
        # top_n=0 means no limit; otherwise apply the cap
        matching_articles = raw_matches if top_n <= 0 else raw_matches.head(top_n)

        print(f"Found {len(matching_articles)} matching articles")

        # Build enriched results in a single pass — no redundant second loop
        enhanced_results = []
        for _, row in matching_articles.iterrows():
            try:
                art_id = int(row['article_id'])
            except (ValueError, TypeError):
                continue

            raw_content = row['content'] if 'content' in row.index else None
            safe_content = str(raw_content) if (raw_content is not None and pd.notna(raw_content)) else ''

            raw_cat = row['category'] if 'category' in row.index else None
            safe_cat = str(raw_cat) if (raw_cat is not None and pd.notna(raw_cat)) else 'general'

            raw_summary = row['summary'] if 'summary' in row.index else None
            safe_summary = str(raw_summary) if (raw_summary is not None and pd.notna(raw_summary)) else 'Summary not available'

            enhanced_results.append({
                'id': art_id,
                'article_id': art_id,
                'similarity_score': 0.5,
                'title': str(row.get('title', safe_content.split('\n')[0][:100] if safe_content else 'Untitled')),
                'content': safe_content,
                'content_preview': safe_content[:200] + '...' if safe_content else '',
                'excerpt': safe_content[:150],
                'summary': safe_summary,
                'imageUrl': 'https://images.unsplash.com/photo-1504711331062-f86b0b51b552?w=500&h=300&fit=crop',
                'author': 'BBC News',
                'category': safe_cat,
            })

        return jsonify(enhanced_results)
    except Exception as e:
        print(f"Search error: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/admin/stats", methods=["GET"])
def get_admin_stats():
    """Get admin statistics"""
    try:
        load_data()
        total_articles = len(ARTICLES_DF)
        categories = ARTICLES_DF['category'].value_counts().to_dict() if 'category' in ARTICLES_DF.columns else {}
        return jsonify({
            "total_articles": total_articles,
            "categories": categories
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/articles", methods=["POST"])
def add_article():
    """Add a new article (admin only)"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400
        
        content = data.get('content', '').strip()
        summary = data.get('summary', '').strip()
        category = data.get('category', 'general').strip()
        title = data.get('title', '').strip()
        
        if not content:
            return jsonify({"error": "Content is required"}), 400
        
        global ARTICLES_DF
        load_data()
        
        new_id = int(ARTICLES_DF['article_id'].max()) + 1 if not ARTICLES_DF.empty else 1
        
        new_row = {
            'article_id': new_id,
            'title': title or content.split('\n')[0][:100],
            'content': content,
            'summary': summary,
            'category': category
        }
        
        ARTICLES_DF = pd.concat([ARTICLES_DF, pd.DataFrame([new_row])], ignore_index=True)
        
        # Save to disk permanently (soft fail on Vercel Read-Only Serverless)
        data_path = ROOT_DIR / "data" / "processed" / "articles_processed.csv"
        try:
            ARTICLES_DF.to_csv(data_path, index=False)
        except OSError:
            print("Vercel Serverless environment detected: skipping local CSV write.")
        
        return jsonify({"message": "Article added", "article_id": new_id}), 201
    except Exception as e:
        print(f"Error adding article: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/articles/<article_id>", methods=["DELETE"])
def delete_article(article_id):
    """Delete an article (admin only)"""
    try:
        global ARTICLES_DF
        load_data()
        
        try:
            aid = int(float(article_id))
        except:
            return jsonify({"error": "Invalid article id"}), 400
        
        if aid not in ARTICLES_DF['article_id'].values:
            return jsonify({"error": "Article not found"}), 404
        
        ARTICLES_DF = ARTICLES_DF[ARTICLES_DF['article_id'] != aid]
        
        # Save to disk permanently (soft fail on Vercel Read-Only Serverless)
        data_path = ROOT_DIR / "data" / "processed" / "articles_processed.csv"
        try:
            ARTICLES_DF.to_csv(data_path, index=False)
        except OSError:
            print("Vercel Serverless environment detected: skipping local CSV write.")
        
        return jsonify({"message": "Article deleted"}), 200
    except Exception as e:
        print(f"Error deleting article: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # Run dev server
    app.run(host="127.0.0.1", port=5000, debug=True)
