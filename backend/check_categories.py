
import csv
from pathlib import Path

try:
    file_path = Path(r"c:\Users\LENOVO\OneDrive\Desktop\article\backend\data\processed\articles_processed.csv")
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
            exit(1)
            
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
