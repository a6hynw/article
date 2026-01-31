
import requests

BASE_URL = "http://127.0.0.1:5000"

def test_category(cat):
    print(f"\n--- Testing Category: {cat} ---")
    url = f"{BASE_URL}/api/articles"
    try:
        response = requests.get(url, params={"category": cat, "limit": 5})
        if response.status_code == 200:
            results = response.json()
            print(f"Found {len(results)} articles")
            for r in results:
                print(f"  - [{r.get('category')}] {r.get('title')}")
        else:
            print(f"Error {response.status_code}")
    except Exception as e:
        print(f"Connection failed: {e}")

print("Testing Category API...")
test_category("tech")
test_category("sport")
test_category("business")
test_category("fake_category")
