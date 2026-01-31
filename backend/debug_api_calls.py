
import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_search(term):
    url = f"{BASE_URL}/api/search"
    try:
        response = requests.post(url, json={"query": term, "top_n": 5})
        if response.status_code == 200:
            results = response.json()
            print(f"Search term: '{term}' -> Found {len(results)} articles")
            for r in results:
                print(f"  - [{r.get('category')}] {r.get('title')}")
        else:
            print(f"Search term: '{term}' -> Error {response.status_code}")
    except Exception as e:
        print(f"Search term: '{term}' -> Connection failed: {e}")

print("Testing Search API...")
test_search("tech")
test_search("sport")
test_search("business")
test_search("health")
