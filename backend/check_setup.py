#!/usr/bin/env python3
"""
Quick setup verification script for Article Recommender System
"""

import sys
from pathlib import Path

def check_backend():
    """Check backend setup"""
    print("\n📦 Checking Backend...")

    try:
        import flask
        print(f"✅ Flask {flask.__version__}")
    except ImportError:
        print("❌ Flask not installed. Run: pip install -r requirements.txt")
        return False

    try:
        import flask_cors
        print("✅ Flask-CORS")
    except ImportError:
        print("❌ Flask-CORS not installed. Run: pip install flask-cors")
        return False

    try:
        import pandas
        print(f"✅ Pandas {pandas.__version__}")
    except ImportError:
        print("❌ Pandas not installed")
        return False

    try:
        import sklearn
        print(f"✅ Scikit-learn {sklearn.__version__}")
    except ImportError:
        print("❌ Scikit-learn not installed")
        return False

    # Check data file
    data_path = Path(__file__).parent / "data" / "processed" / "articles_processed.csv"
    if data_path.exists():
        print(f"✅ Data file found: {data_path}")
    else:
        print(f"❌ Data file not found at: {data_path}")
        print("   Run preprocessing script first")
        return False

    return True

def check_frontend():
    """Check frontend setup"""
    print("\n🎨 Checking Frontend...")

    templates_dir = Path(__file__).parent / "templates"

    if not templates_dir.exists():
        print(f"❌ Templates directory not found")
        return False

    print(f"✅ Templates directory found")

    # Check package.json
    package_json = templates_dir / "package.json"
    if package_json.exists():
        print("✅ package.json found")
    else:
        print("❌ package.json not found")
        return False

    # Check node_modules
    node_modules = templates_dir / "node_modules"
    if node_modules.exists():
        print("✅ node_modules found (npm dependencies installed)")
    else:
        print("⚠️  node_modules not found. Run: cd templates && npm install")
        return False

    # Check React components
    components_dir = templates_dir / "src" / "components"
    required_components = [
        "ArticleCard.jsx",
        "ArticleModal.jsx",
        "SearchBar.jsx",
        "LoadingSpinner.jsx"
    ]

    for component in required_components:
        component_path = components_dir / component
        if component_path.exists():
            print(f"✅ {component}")
        else:
            print(f"❌ {component} not found")
            return False

    return True

def main():
    print("=" * 50)
    print("📚 Article Recommender System - Setup Check")
    print("=" * 50)

    backend_ok = check_backend()
    frontend_ok = check_frontend()

    print("\n" + "=" * 50)

    if backend_ok and frontend_ok:
        print("✅ All checks passed! Ready to run:")
        print("\n   Terminal 1 (Backend):")
        print("   $ python app.py")
        print("\n   Terminal 2 (Frontend):")
        print("   $ cd templates && npm run dev")
        print("\n   Then open: http://localhost:5173")
        return 0
    else:
        print("❌ Some checks failed. Please fix the issues above.")
        if not backend_ok:
            print("\nBackend issues - run: pip install -r requirements.txt")
        if not frontend_ok:
            print("\nFrontend issues - run: cd templates && npm install")
        return 1

if __name__ == "__main__":
    sys.exit(main())
