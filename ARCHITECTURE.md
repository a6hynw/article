# Article Recommendation System

A full-stack application combining **Python Flask** backend with **ReactJS** frontend for intelligent article recommendations using TF-IDF and cosine similarity.

---

## 📁 Project Structure

```
article/
├── backend/                    # Python Flask Backend
│   ├── app.py                 # Main Flask application & API endpoints
│   ├── requirements.txt        # Python dependencies
│   ├── check_setup.py         # Setup verification script
│   ├── preprocess_data.py     # Data preprocessing pipeline
│   ├── model.py               # Model exploration utilities
│   ├── src/
│   │   ├── preprocessing/     # Text preprocessing module (NLTK)
│   │   └── recommendation/    # TF-IDF recommender system
│   └── data/
│       ├── raw/              # Raw BBC News dataset
│       └── processed/        # Processed CSV for model training
│
├── frontend/                   # ReactJS Frontend
│   ├── package.json           # Node.js dependencies
│   ├── index.html             # HTML entry point
│   ├── vite.config.js         # Vite bundler config
│   ├── tailwind.config.js     # Tailwind CSS theme
│   ├── src/
│   │   ├── main.jsx           # React DOM entry point
│   │   ├── App.jsx            # Root component
│   │   ├── App.css            # Global styles & animations
│   │   ├── components/        # Reusable React components
│   │   │   ├── ArticleCard.jsx
│   │   │   ├── ArticleGrid.jsx
│   │   │   ├── ArticleView.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── InterestSelector.jsx
│   │   │   └── ui/
│   │   ├── pages/             # Page-level components
│   │   │   └── index.jsx
│   │   └── utils/             # Helper functions
│   │       ├── api.js         # Flask API client
│   │       └── constants.js   # UI constants & categories
│   └── public/                # Static assets
│
└── README.md                   # You are here
```

---

## 🚀 Quick Start

### Prerequisites
- **Backend**: Python 3.8+, pip
- **Frontend**: Node.js 16+, npm

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Verify everything is installed correctly
python check_setup.py

# Preprocess data (generates articles_processed.csv)
python preprocess_data.py

# Start Flask server
python app.py
```

**Backend runs on**: `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```

**Frontend runs on**: `http://localhost:5173`

---

## 🔌 API Endpoints

### Articles API
- `GET /api/articles?limit=10` - Fetch articles
- `GET /api/article/<id>` - Get single article details
- `POST /api/search` - Search articles by text query

### Recommendations API
- `GET /api/recommendations/<id>?top_n=5` - Get similar articles

---

## 💻 Technology Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| **Flask** | Web framework & REST API |
| **Pandas** | Data manipulation & CSV handling |
| **Scikit-learn** | TF-IDF vectorization & cosine similarity |
| **NLTK** | Text preprocessing & tokenization |
| **Flask-CORS** | Cross-origin request handling |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Icon library |

---

## 🔄 Data Flow

1. **Raw Data** → `backend/data/raw/bbc_news_text_complexity_summarization.csv`
2. **Preprocessing** → Text cleaning, tokenization, lemmatization
3. **Processed Data** → `backend/data/processed/articles_processed.csv`
4. **Model Training** → TF-IDF vectorizer fitted on processed content
5. **API Requests** → React app calls Flask endpoints
6. **Recommendations** → Cosine similarity computed on TF-IDF matrix
7. **Frontend Rendering** → React displays articles in beautiful UI

---

## 📝 Key Features

✨ **Default Articles** - 10 articles load automatically  
🔍 **Full-Text Search** - Find articles by keyword or ID  
🤖 **Smart Recommendations** - TF-IDF + cosine similarity  
🎨 **Beautiful UI** - Responsive design with Tailwind CSS  
⚡ **Real-time** - Instant API integration  
📱 **Mobile-Friendly** - Works on all screen sizes  

---

## 🛠️ Development

### Run Backend During Development
```bash
cd backend
python app.py
```

### Run Frontend During Development
```bash
cd frontend
npm run dev
```

### Build Frontend for Production
```bash
cd frontend
npm run build
npm run preview
```

---

## 🐛 Troubleshooting

### Backend Issues

**Dependencies missing?**
```bash
cd backend
pip install -r requirements.txt
python check_setup.py
```

**Processed data missing?**
```bash
cd backend
python preprocess_data.py
```

### Frontend Issues

**Port 5173 already in use?**
```bash
cd frontend
npm run dev -- --port 3000  # Use different port
```

**Node modules corrupted?**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Connection Issues

**Backend not found by frontend?**
- Ensure backend is running: `python backend/app.py`
- Check it's on `http://localhost:5000`
- Browser console should show no CORS errors

---

## 📖 Additional Documentation

- `backend/README.md` - Backend-specific documentation
- `frontend/README.md` - Frontend-specific documentation
- `QUICK_START.md` - 4-step setup guide
- `IMPLEMENTATION_SUMMARY.md` - Feature details

---

## 🎯 Next Steps

1. ✅ Set up backend and run `python check_setup.py`
2. ✅ Set up frontend and run `npm install`
3. ✅ Start backend: `python backend/app.py`
4. ✅ Start frontend: `cd frontend && npm run dev`
5. 🌐 Open `http://localhost:5173` in browser

---

**Created**: January 28, 2026  
**Last Updated**: January 28, 2026
