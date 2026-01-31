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

    # Then try to import/fit the recommender; if it fails, leave RECOMMENDER as None
    if RECOMMENDER is None:
        TFIDFRecommender = import_recommender()
        RECOMMENDER = TFIDFRecommender()
        RECOMMENDER.fit(ARTICLES_DF)


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

    # Try to lazily load data first; then attempt to load the model.
    try:
        load_data()
    except Exception as e:
        error = f"Data load error: {e}"
        error += "\n" + traceback.format_exc()

    # Attempt to load the recommender but don't fail the page if it errors
    if error is None:
        try:
            load_data_and_model()
        except Exception as e:
            error = f"Model load error: {e}"
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
            # Filter by category (case-insensitive)
            filtered_df = ARTICLES_DF[
                ARTICLES_DF['category'].str.lower() == category_filter.lower()
            ]
            
        if limit and limit > 0:
            articles = filtered_df.head(limit).copy()
        else:
            articles = filtered_df.copy()
        
        # Add derived fields for frontend
        articles['id'] = articles['article_id']
        articles['title'] = articles['content'].str.split('\n').str[0].str[:80]
        articles['imageUrl'] = 'https://images.unsplash.com/photo-1617957796155-72d8717ac882?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        articles['author'] = 'BBC News'
        # Ensure category is present (it should be)
        if 'category' not in articles.columns:
             articles['category'] = 'general'
             
        articles['excerpt'] = articles['content'].str[:150]
        
        result = articles[['id', 'article_id', 'title', 'content', 'summary', 'imageUrl', 'author', 'category', 'excerpt']].to_dict(orient='records')
        return jsonify(result)
    except Exception as e:
        print(f"Error in get_articles: {e}")
        import traceback
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

        # Try to coerce article_id to an integer indexable value
        try:
            # handle values like '0', '0.0', 0.0
            if isinstance(article_id, str) and article_id.endswith('.0'):
                article_id_int = int(float(article_id))
            else:
                article_id_int = int(float(article_id))
        except Exception:
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
        article_data['id'] = article_data['article_id']
        article_data['title'] = article_data['content'].split('\n')[0][:100]
        article_data['imageUrl'] = 'https://images.unsplash.com/photo-1504711331062-f86b0b51b552?w=800&h=400&fit=crop'
        article_data['author'] = 'BBC News'
        article_data['category'] = article['category']
        
        return jsonify(article_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/recommendations/<article_id>", methods=["GET"])
def get_recommendations(article_id):
    """Get recommendations for a specific article. Accept non-integer URL ids and coerce."""
    try:
        load_data_and_model()
        top_n = request.args.get('top_n', default=5, type=int)

        # coerce similar to get_article
        try:
            article_id_int = int(float(article_id))
        except Exception:
            article_id_int = None

        if article_id_int is None:
            return jsonify({"error": "Invalid article id"}), 400

        results = RECOMMENDER.get_recommendations(article_id_int, top_n=top_n)
        
        # Enhance results with additional fields for frontend
        enhanced_results = []
        for rec in results:
            article_idx = ARTICLES_DF[ARTICLES_DF['article_id'] == rec['article_id']].index
            if len(article_idx) > 0:
                article = ARTICLES_DF.iloc[article_idx[0]]
                rec['id'] = rec['article_id']
                rec['title'] = article['content'].split('\n')[0][:100]
                rec['imageUrl'] = 'https://images.unsplash.com/photo-1617957743103-310accdfb999?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                rec['author'] = 'BBC News'
                rec['category'] = article['category']
                rec['excerpt'] = article['content'][:150]
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
        query = data.get('query', '').strip()
        top_n = data.get('top_n', 5)
        
        if not query:
            return jsonify({"error": "Query is required"}), 400
            
        # Use simple text search for now
        print(f"Searching for: {query}")
        # Search in content OR category OR title (splitting content)
        # We'll prioritize content matches but this ensures if we search 'tech' we get tech articles
        matching_articles = ARTICLES_DF[
            ARTICLES_DF['content'].str.contains(query, case=False, na=False) |
            ARTICLES_DF['category'].str.contains(query, case=False, na=False)
        ].head(top_n)
        
        print(f"Found {len(matching_articles)} matching articles")
        
        results = []
        for _, article in matching_articles.iterrows():
            results.append({
                "article_id": int(article["article_id"]),
                "similarity_score": 0.5,  # dummy score
                "content_preview": article["content"][:200] + "...",
                "summary": article.get("summary", "Summary not available")
            })
        
        # Enhance results with additional fields for frontend
        enhanced_results = []
        for rec in results:
            article_idx = ARTICLES_DF[ARTICLES_DF['article_id'] == rec['article_id']].index
            if len(article_idx) > 0:
                article = ARTICLES_DF.iloc[article_idx[0]]
                rec['id'] = rec['article_id']
                rec['title'] = article['content'].split('\n')[0][:100]
                rec['imageUrl'] = 'https://images.unsplash.com/photo-1504711331062-f86b0b51b552?w=500&h=300&fit=crop'
                rec['author'] = 'BBC News'
                rec['category'] = article['category']
                rec['excerpt'] = article['content'][:150]
            enhanced_results.append(rec)
        
        return jsonify(enhanced_results)
    except Exception as e:
        print(f"Search error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # Run dev server
    app.run(host="127.0.0.1", port=5000, debug=True)
