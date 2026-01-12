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

    # ✅ Correct column names for BBC dataset
    # The provided BBC CSV uses 'text' for the article body
    TITLE_COLUMN = None                  # No title column
    CONTENT_COLUMN = "text"
    SUMMARY_COLUMN = "text_rank_summary"  # Summary column
    CATEGORY_COLUMN = None               # No category column

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

    # Remove very short articles
    df = df[df[CONTENT_COLUMN].str.len() > 50]
    print(f"   ✅ Remaining articles: {len(df)}")

    # Use content as full text
    print("\n4. Preparing full text...")
    df["full_text"] = df[CONTENT_COLUMN]

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
    df["article_id"] = range(len(df))

    # Select final columns
    df = df[["article_id", CONTENT_COLUMN, SUMMARY_COLUMN, "processed_content"]]
    df = df.rename(columns={CONTENT_COLUMN: "content", SUMMARY_COLUMN: "summary"})

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
