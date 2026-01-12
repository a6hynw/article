from pathlib import Path
from flask import Flask, render_template, request
import pandas as pd
import traceback

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

# Global (lazy) model and data holders
RECOMMENDER = None
ARTICLES_DF = None


def load_data_and_model():
    global RECOMMENDER, ARTICLES_DF

    if RECOMMENDER is not None and ARTICLES_DF is not None:
        return

    data_path = ROOT_DIR / "data" / "processed" / "articles_processed.csv"
    if not data_path.exists():
        raise FileNotFoundError(f"Processed data not found at: {data_path}")

    ARTICLES_DF = pd.read_csv(data_path)

    TFIDFRecommender = import_recommender()
    RECOMMENDER = TFIDFRecommender()
    RECOMMENDER.fit(ARTICLES_DF)


@app.route("/", methods=["GET", "POST"])
def index():
    error = None
    results = None
    query = None
    top_n = 5

    # Try to lazily load model; capture errors to display in the UI
    try:
        load_data_and_model()
    except Exception as e:
        error = f"Model/data load error: {e}"
        # Include traceback for debugging convenience
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


if __name__ == "__main__":
    # Run dev server
    app.run(host="127.0.0.1", port=5000, debug=True)
