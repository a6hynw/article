import sys
from pathlib import Path

# Ensure src is in Python path
ROOT_DIR = Path(__file__).resolve().parent
SRC_DIR = ROOT_DIR / "src"
sys.path.append(str(SRC_DIR))

import pandas as pd
from preprocessing.preprocess import TextPreprocessor


def preprocess_dataset():
    print("=" * 60)
    print("STARTING DATA PREPROCESSING")
    print("=" * 60)

    # Load raw data
    print("\n1. Loading raw data...")
    input_path = ROOT_DIR / "data" / "raw" / "bbc_news_text_complexity_summarization.csv"
    print("Looking for file at:", input_path)
    print("File exists:", input_path.exists())

    if not input_path.exists():
        print(f"   ❌ File not found at {input_path}")
        return

    df = pd.read_csv(input_path)
    print(f"   ✅ Loaded {len(df)} articles")

    # Detect best matching columns for title, content, summary, category
    CONTENT_COLUMN = None
    TITLE_COLUMN = None
    SUMMARY_COLUMN = None
    CATEGORY_COLUMN = None

    # common candidate names
    content_candidates = ["text", "content", "article", "body"]
    title_candidates = ["title", "headline", "name", "article_title", "heading"]
    summary_candidates = ["text_rank_summary", "summary", "short_summary", "abstract"]
    category_candidates = ["category", "categories", "labels", "topic", "section", "label", "tags"]

    cols_lower = {c.lower(): c for c in df.columns}

    for cand in content_candidates:
        if cand in cols_lower:
            CONTENT_COLUMN = cols_lower[cand]
            break

    for cand in title_candidates:
        if cand in cols_lower:
            TITLE_COLUMN = cols_lower[cand]
            break

    for cand in summary_candidates:
        if cand in cols_lower:
            SUMMARY_COLUMN = cols_lower[cand]
            break

    for cand in category_candidates:
        if cand in cols_lower:
            CATEGORY_COLUMN = cols_lower[cand]
            break

    # Fallback: require content column to exist
    if CONTENT_COLUMN is None:
        print("   ❌ No content column found. Available columns:", df.columns.tolist())
        return

    # Verify content column
    print("\n2. Verifying columns...")
    if CONTENT_COLUMN not in df.columns:
        print(f"   ❌ Column '{CONTENT_COLUMN}' not found!")
        print(f"   Available columns: {df.columns.tolist()}")
        return

    print("   ✅ Columns verified")

    # Handle missing values
    print("\n3. Handling missing values...")
    df[CONTENT_COLUMN] = df[CONTENT_COLUMN].fillna("")

    # Ensure title/summary/category columns exist (create defaults if missing)
    if TITLE_COLUMN is None:
        # create title from first line / first 120 chars of content
        df["title"] = df[CONTENT_COLUMN].astype(str).str.split('\n').str[0].str.strip().str[:120]
        TITLE_COLUMN = "title"
    else:
        df[TITLE_COLUMN] = df[TITLE_COLUMN].fillna("").astype(str)

    if SUMMARY_COLUMN is None:
        # use a short excerpt as summary fallback
        df["summary"] = df[CONTENT_COLUMN].astype(str).str[:200]
        SUMMARY_COLUMN = "summary"
    else:
        df[SUMMARY_COLUMN] = df[SUMMARY_COLUMN].fillna("").astype(str)

    if CATEGORY_COLUMN is None:
        df["category"] = "general"
        CATEGORY_COLUMN = "category"
    else:
        # Preserve original labels column name (may be 'labels')
        df[CATEGORY_COLUMN] = df[CATEGORY_COLUMN].fillna("").astype(str)
        # If the field is a labels-style list (comma-separated or bracketed), extract the first label for category
        def first_label(val):
            if not val:
                return "general"
            s = val
            # remove surrounding brackets/quotes
            s = s.strip()
            if s.startswith("[") and s.endswith("]"):
                s = s[1:-1]
            # split on common separators
            for sep in [",", ";", "|"]:
                if sep in s:
                    parts = [p.strip().strip("'\"") for p in s.split(sep) if p.strip()]
                    return parts[0] if parts else "general"
            # single value, strip quotes
            return s.strip().strip("'\"") or "general"

        # create/ensure a normalized `category` column that holds the primary label
        df["category"] = df[CATEGORY_COLUMN].apply(first_label)
        # keep original labels column if it's named differently
        if CATEGORY_COLUMN != "category":
            df["labels"] = df[CATEGORY_COLUMN]
            CATEGORY_COLUMN = "labels"

    # Remove very short articles
    df = df[df[CONTENT_COLUMN].str.len() > 50]
    print(f"   ✅ Remaining articles: {len(df)}")

    # Use content as full text
    print("\n4. Preparing full text...")
    df["full_text"] = df[CONTENT_COLUMN].astype(str)

    # Initialize preprocessor
    print("\n5. Initializing text preprocessor...")
    preprocessor = TextPreprocessor()

    # Preprocess all articles
    print("\n6. Processing articles...")
    processed_texts = []

    for idx, text in enumerate(df["full_text"]):
        if idx % 100 == 0:
            print(f"   Processing article {idx}/{len(df)}")

        processed_texts.append(preprocessor.preprocess(text))

    df["processed_content"] = processed_texts
    print("   ✅ All articles processed")

    # Filter short processed articles
    print("\n7. Filtering processed articles...")
    df = df[df["processed_content"].str.len() > 20]
    print(f"   ✅ Final dataset size: {len(df)}")

    # Add article ID
    df = df.reset_index(drop=True)
    df["article_id"] = df.index.astype(int)

    # Select final columns and ensure names are standardized.
    # Note: CATEGORY_COLUMN may have been reassigned to 'labels' above; in that
    # case 'category' already exists as a normalized column from first_label().
    # We always include the 'category' column explicitly and avoid re-renaming it.
    final_cols = ["article_id", CONTENT_COLUMN, SUMMARY_COLUMN, "processed_content", TITLE_COLUMN, "category"]
    # If the raw labels column is different from 'category', keep it too
    if CATEGORY_COLUMN not in ("category", None) and CATEGORY_COLUMN in df.columns:
        final_cols.append(CATEGORY_COLUMN)
    # Deduplicate and preserve order, skipping missing columns
    seen = set()
    final_cols = [c for c in final_cols if c in df.columns and not (c in seen or seen.add(c))]

    df = df[final_cols]
    rename_map = {CONTENT_COLUMN: "content", SUMMARY_COLUMN: "summary", TITLE_COLUMN: "title"}
    # Only rename CATEGORY_COLUMN to 'labels' if it is not already 'category'
    if CATEGORY_COLUMN and CATEGORY_COLUMN != "category" and CATEGORY_COLUMN in df.columns:
        rename_map[CATEGORY_COLUMN] = "labels"
    df = df.rename(columns=rename_map)

    # Save processed data
    print("\n8. Saving processed data...")
    output_path = ROOT_DIR / "data" / "processed" / "articles_processed.csv"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)

    print(f"   ✅ Saved to {output_path}")

    # Statistics
    print("\n" + "=" * 60)
    print("PREPROCESSING COMPLETE")
    print("=" * 60)
    print(f"Total articles: {len(df)}")
    print(
        f"Average processed length: {df['processed_content'].str.len().mean():.0f} characters"
    )

    # Example
    print("\n" + "=" * 60)
    print("EXAMPLE ARTICLE")
    print("=" * 60)
    print("\nOriginal Content (first 200 chars):")
    print(df.iloc[0]["content"][:200] + "...")
    print("\nProcessed Content (first 200 chars):")
    print(df.iloc[0]["processed_content"][:200] + "...")

    print("\n✅ Preprocessing successful!")
    print(f"✅ Output saved at: {output_path}")


if __name__ == "__main__":
    preprocess_dataset()
