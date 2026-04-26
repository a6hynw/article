"""
Dataset exploration / EDA script.

Run from the repo root:
    python backend/model.py

The script resolves all paths relative to its own location so it works on
any machine regardless of where the repo was cloned.
"""
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend — safe on any machine / CI
import matplotlib.pyplot as plt
from pathlib import Path

# All paths are relative to this script's location — no hardcoded user paths.
ROOT_DIR = Path(__file__).resolve().parent
data_path = ROOT_DIR / "data" / "raw" / "bbc_news_text_complexity_summarization.csv"

# Load the dataset
print("Loading dataset...")
print(f"Looking for file at: {data_path}")

if not data_path.exists():
    raise FileNotFoundError(
        f"Dataset not found at {data_path}. "
        "Please ensure the raw data file is placed in backend/data/raw/."
    )

df = pd.read_csv(data_path)

# Display basic information
print("\n" + "="*60)
print("DATASET INFORMATION")
print("="*60)

print(f"\nTotal number of articles: {len(df)}")
print(f"\nColumn names: {df.columns.tolist()}")
print(f"\nDataset shape (rows, columns): {df.shape}")

print("\n" + "="*60)
print("FIRST 5 ROWS")
print("="*60)
print(df.head())

print("\n" + "="*60)
print("MISSING VALUES")
print("="*60)
print(df.isnull().sum())

print("\n" + "="*60)
print("DATA TYPES")
print("="*60)
print(df.dtypes)

# Check unique categories
if 'category' in df.columns:
    print("\n" + "="*60)
    print("CATEGORIES")
    print("="*60)
    print(df['category'].value_counts())

# Check article lengths
if 'content' in df.columns:
    df['content_length'] = df['content'].astype(str).str.len()
    print("\n" + "="*60)
    print("ARTICLE LENGTH STATISTICS")
    print("="*60)
    print(f"Average length: {df['content_length'].mean():.0f} characters")
    print(f"Minimum length: {df['content_length'].min()} characters")
    print(f"Maximum length: {df['content_length'].max()} characters")

print("\n" + "="*60)
print("SAMPLE ARTICLE")
print("="*60)

if 'text_rank_summary' in df.columns:
    print(f"\nTextRank Summary:\n{df.iloc[0]['text_rank_summary']}")

if 'content' in df.columns:
    print(f"\nContent preview:\n{df.iloc[0]['content'][:300]}...")

print("\n✅ Dataset exploration complete!")
print("\nNote the column names above. You'll need them for next steps.")
