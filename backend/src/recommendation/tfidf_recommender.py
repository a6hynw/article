import sys
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import os

# --- Path setup ---
# ROOT_DIR should point to the backend directory (two levels above this file:
# recommendation -> src -> backend). Use parents[2] so ROOT_DIR resolves to
# the `backend` folder and data/src imports work correctly when running the app
# from the repository root or from the backend folder.
ROOT_DIR = Path(__file__).resolve().parents[2]
SRC_DIR = ROOT_DIR / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from preprocessing.preprocess import TextPreprocessor


class TFIDFRecommender:
    def __init__(self):
        print("Initializing TF-IDF Recommender...")

        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            min_df=2,
            max_df=0.8,
            ngram_range=(1, 2),
            strip_accents="unicode",
            lowercase=True
        )

        self.tfidf_matrix = None
        self.similarity_matrix = None
        self.articles_df = None

        print("✅ Recommender initialized!")

    def fit(self, articles_df):
        print("\n" + "=" * 60)
        print("TRAINING TF-IDF MODEL")
        print("=" * 60)

        self.articles_df = articles_df.reset_index(drop=True)

        # Ensure processed_content exists; if not, try to create from `content`
        if "processed_content" not in self.articles_df.columns:
            print("processed_content column missing; attempting to create from 'content' using TextPreprocessor...")
            preproc = TextPreprocessor()
            if "content" not in self.articles_df.columns:
                raise ValueError("No 'processed_content' or 'content' column found in articles_df")
            self.articles_df["processed_content"] = self.articles_df["content"].fillna("").astype(str).map(preproc.preprocess)

        print(f"\n1. Processing {len(self.articles_df)} articles...")

        print("\n2. Creating TF-IDF vectors...")
        texts = self.articles_df["processed_content"].fillna("").astype(str).tolist()
        if len(texts) == 0:
            raise ValueError("No texts available to fit TF-IDF vectorizer")

        self.tfidf_matrix = self.vectorizer.fit_transform(texts)

        print(f"   ✅ TF-IDF matrix shape: {self.tfidf_matrix.shape}")

        print("\n3. Calculating cosine similarity...")
        # Compute cosine similarity (may be memory heavy for large corpora)
        try:
            self.similarity_matrix = cosine_similarity(self.tfidf_matrix)
        except Exception as e:
            print(f"Error computing similarity matrix: {e}")
            self.similarity_matrix = None

        print("\n✅ MODEL TRAINING COMPLETE!")
        return self

    def get_recommendations(self, article_id, top_n=10):
        if self.articles_df is None:
            print("❌ Recommender has not been fitted yet")
            return []

        if article_id not in self.articles_df["article_id"].values:
            print(f"❌ Article ID {article_id} not found")
            return []

        if self.similarity_matrix is None:
            print("❌ Similarity matrix not available; ensure fit() completed successfully")
            return []

        article_idx = self.articles_df[
            self.articles_df["article_id"] == article_id
        ].index[0]

        similarity_scores = self.similarity_matrix[article_idx]
        similar_indices = similarity_scores.argsort()[::-1][1:top_n + 1]

        recommendations = []
        for idx in similar_indices:
            article = self.articles_df.iloc[idx]
            recommendations.append({
                "article_id": int(article["article_id"]),
                "similarity_score": float(similarity_scores[idx]),
                "content_preview": article["content"][:200] + "...",
                "summary": article.get("summary", "Summary not available")
            })

        return recommendations

    def search_by_text(self, text, top_n=10):
        preprocessor = TextPreprocessor()
        processed_text = preprocessor.preprocess(text)

        if self.tfidf_matrix is None or self.vectorizer is None:
            print("❌ Model not fitted; search_by_text requires a fitted model")
            return []

        text_vector = self.vectorizer.transform([processed_text])
        similarities = cosine_similarity(text_vector, self.tfidf_matrix)[0]

        top_indices = similarities.argsort()[::-1][:top_n]

        results = []
        for idx in top_indices:
            article = self.articles_df.iloc[idx]
            results.append({
                "article_id": int(article["article_id"]),
                "similarity_score": float(similarities[idx]),
                "content_preview": article["content"][:200] + "...",
                "summary": article.get("summary", "Summary not available")
            })

        return results

    def save_model(self, filepath=None):
        if filepath is None:
            filepath = ROOT_DIR / "data" / "models" / "tfidf_recommender.pkl"

        os.makedirs(Path(filepath).parent, exist_ok=True)

        with open(filepath, "wb") as f:
            pickle.dump({
                "vectorizer": self.vectorizer,
                "tfidf_matrix": self.tfidf_matrix,
                "similarity_matrix": self.similarity_matrix,
                "articles_df": self.articles_df
            }, f)

        print(f"✅ Model saved to {filepath}")

    @classmethod
    def load_model(cls, filepath):
        with open(filepath, "rb") as f:
            data = pickle.load(f)

        model = cls()
        model.vectorizer = data["vectorizer"]
        model.tfidf_matrix = data["tfidf_matrix"]
        model.similarity_matrix = data["similarity_matrix"]
        model.articles_df = data["articles_df"]

        print("✅ Model loaded successfully!")
        return model


# ---------------- TEST ----------------
if __name__ == "__main__":
    print("Testing TF-IDF Recommender...")

    data_path = ROOT_DIR / "data" / "processed" / "articles_processed.csv"
    df = pd.read_csv(data_path)

    recommender = TFIDFRecommender()
    recommender.fit(df)

    test_article_id = df.iloc[0]["article_id"]

    print("\nTop 5 recommendations:")
    recs = recommender.get_recommendations(test_article_id, top_n=5)
    for i, rec in enumerate(recs, 1):
        print(f"{i}. Summary: {rec['summary']} | Score: {rec['similarity_score']:.3f}")
