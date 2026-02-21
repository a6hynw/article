import csv
from pathlib import Path

def main():
    try:
        file_path = Path(__file__).parent / "data" / "processed" / "articles_processed.csv"
        if not file_path.exists():
            print(f"Data file not found: {file_path}")
            return

        categories = set()
        category_counts = {}

        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            header = next(reader)
            # Find category index
            try:
                cat_idx = header.index('category')
            except ValueError:
                print(f"Category column not found in header: {header}")
                return

            for row in reader:
                if len(row) > cat_idx:
                    cat = row[cat_idx]
                    categories.add(cat)
                    category_counts[cat] = category_counts.get(cat, 0) + 1

        print("Unique categories found:")
        print(categories)
        print("\nCategory counts:")
        for cat, count in category_counts.items():
            print(f"{cat}: {count}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    main()
