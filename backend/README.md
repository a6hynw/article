# Backend - Python Flask API

Article Recommendation System backend built with Flask, Pandas, and Scikit-learn.

## 📋 Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Verify setup
python check_setup.py

# Preprocess data
python preprocess_data.py

# Run server
python app.py
```

Server runs on `http://localhost:5000`

## 📁 Structure

```
backend/
├── app.py                    # Flask app & API endpoints
├── requirements.txt          # Python dependencies
├── check_setup.py           # Dependency verification
├── preprocess_data.py       # Data preprocessing
├── model.py                 # Model utilities
├── src/
│   ├── preprocessing/       # Text preprocessing
│   │   ├── __init__.py
│   │   └── preprocess.py
│   └── recommendation/      # TF-IDF recommender
│       ├── __init__.py
│       └── tfidf_recommender.py
└── data/
    ├── raw/                 # Raw dataset
    └── processed/           # Processed CSV
```

## 🔌 API Endpoints

### Articles
- `GET /api/articles?limit=10` - Get articles
- `GET /api/article/<id>` - Get single article

### Search & Recommendations
- `POST /api/search` - Search articles
- `GET /api/recommendations/<id>?top_n=5` - Get recommendations

## 🔧 Configuration

- `HOST`: 127.0.0.1
- `PORT`: 5000
- `DEBUG`: True (development)

## 📊 Data Processing

1. Raw BBC News CSV → `data/raw/`
2. Text preprocessing (NLTK) → Cleaning, tokenization, lemmatization
3. Processed CSV → `data/processed/articles_processed.csv`
4. TF-IDF vectorization → Model training
5. Cosine similarity → Recommendations

## 🐛 Troubleshooting

**Module not found errors?**
```bash
python check_setup.py
pip install -r requirements.txt
```

**Data file not found?**
```bash
python preprocess_data.py
```

**Port 5000 in use?**
```bash
# Modify app.py: change port=5000 to port=5001
python app.py
```
