# Quick Reference - Article Discovery AI

## 🚀 Start Application (5 minutes)

### Terminal 1: Backend
```bash
cd backend
python app.py
```
✓ Backend runs at: `http://localhost:5000`

### Terminal 2: Frontend  
```bash
cd frontend
npm run dev
```
✓ Frontend runs at: `http://localhost:5173`

### Open Browser
→ http://localhost:5173

---

## 🔧 First-Time Setup

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

Or use quick start (Windows):
```bash
QUICK_START.bat
```

---

## 📡 API Endpoints Quick Ref

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/articles` | GET | List articles |
| `/api/article/{id}` | GET | Article details |
| `/api/recommendations/{id}` | GET | Similar articles |
| `/api/search` | POST | Search articles |

### Example Requests

**Get Articles**
```
GET http://localhost:5000/api/articles?limit=10
```

**Get Recommendations**
```
GET http://localhost:5000/api/recommendations/42?top_n=5
```

**Search Articles**
```
POST http://localhost:5000/api/search
Content-Type: application/json

{
  "query": "technology",
  "top_n": 10
}
```

---

## 📁 Project Structure

```
article/
├── backend/
│   ├── app.py                    ← Flask server
│   ├── requirements.txt           ← Python dependencies
│   ├── src/
│   │   ├── recommendation/       ← TF-IDF model
│   │   └── preprocessing/        ← Text processor
│   └── data/processed/articles_processed.csv
│
├── frontend/
│   ├── src/
│   │   ├── components/           ← React components
│   │   ├── pages/index.jsx       ← Main page
│   │   └── utils/api.js          ← API calls
│   ├── package.json              ← Node dependencies
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env                      ← API config
│
├── SETUP_GUIDE.md                ← Full documentation
├── QUICK_START.bat               ← Auto setup (Windows)
└── FIXES_SUMMARY.md              ← What was fixed
```

---

## 🛠️ Common Tasks

### Change API URL
Edit `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:5000
```

### Install Missing Packages
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

### Build Frontend for Production
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

### Run Backend in Production Mode
```bash
# In app.py, change:
debug=True  →  debug=False
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 already in use | Change port in `app.py` |
| Python not found | Install Python 3.8+ |
| npm install fails | Delete `node_modules` & run again |
| API calls fail | Check backend is running at `:5000` |
| CSS looks broken | Check Tailwind is compiling (npm dev) |

---

## 🎨 Features

✨ **Frontend**
- Interest-based filtering
- Article search
- Responsive design
- Dark mode support

🤖 **Backend**
- TF-IDF vectorization
- Cosine similarity matching
- Fast recommendations
- CORS enabled

---

## 📊 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS 4 |
| Backend | Flask |
| ML Model | Scikit-learn TF-IDF |
| Data | Pandas |

---

## 📞 Support

1. Check SETUP_GUIDE.md for detailed docs
2. Review FIXES_SUMMARY.md for recent changes
3. Check browser console for frontend errors
4. Check terminal for backend errors

---

**Status**: ✅ Working  
**Last Updated**: January 28, 2026
