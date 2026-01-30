# Article Discovery AI Project - Setup & Usage Guide

## Project Overview
This is a full-stack AI-powered article discovery application with:
- **Backend**: Python Flask API with TF-IDF recommendation engine
- **Frontend**: React + Vite with Tailwind CSS UI
- **Algorithm**: TF-IDF + Cosine Similarity for article recommendations

## Project Structure

```
article/
├── backend/              # Python Flask backend
│   ├── app.py           # Main Flask application
│   ├── requirements.txt  # Python dependencies
│   ├── src/
│   │   ├── recommendation/  # TF-IDF recommender
│   │   └── preprocessing/   # Text preprocessing
│   └── data/
│       ├── raw/         # Original BBC news dataset
│       └── processed/   # Processed articles CSV
└── frontend/            # React + Vite frontend
    ├── package.json     # Node dependencies
    ├── vite.config.js   # Vite configuration
    ├── tailwind.config.js
    └── src/
        ├── components/  # React components
        ├── pages/       # Page components
        └── utils/       # API utilities
```

## Prerequisites

### Backend Requirements
- Python 3.8+
- pip

### Frontend Requirements
- Node.js 16+
- npm

## Setup Instructions

### 1. Backend Setup

#### Step 1: Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

**Required packages:**
- pandas - Data manipulation
- numpy - Numerical computing
- scikit-learn - ML algorithms
- nltk - NLP processing
- flask - Web framework
- flask-cors - CORS support

#### Step 2: Verify Data
Ensure the processed dataset exists at:
```
backend/data/processed/articles_processed.csv
```

The CSV should have columns:
- `article_id` - Unique article identifier
- `content` - Full article text
- `summary` - Article summary
- `processed_content` - Preprocessed text for model

#### Step 3: Start Backend Server
```bash
cd backend
python app.py
```

The server will start at: **http://localhost:5000**

### 2. Frontend Setup

#### Step 1: Install Node Dependencies
```bash
cd frontend
npm install
```

#### Step 2: Configure Environment
The `.env` file is already configured:
```
VITE_API_BASE_URL=http://localhost:5000
```

#### Step 3: Start Development Server
```bash
npm run dev
```

The frontend will start at: **http://localhost:5173**

## API Endpoints

### Articles
- `GET /api/articles?limit=10` - Get articles list
- `GET /api/article/{article_id}` - Get single article

### Recommendations
- `GET /api/recommendations/{article_id}?top_n=5` - Get article recommendations

### Search
- `POST /api/search` - Search articles by keyword
  ```json
  {
    "query": "technology",
    "top_n": 10
  }
  ```

## Features

### Frontend Features
✅ Interest-based article filtering
✅ Article search by keyword
✅ AI-powered recommendations
✅ Responsive design with Tailwind CSS
✅ Smooth animations and transitions
✅ Dark mode support
✅ LocalStorage for user preferences

### Backend Features
✅ TF-IDF vectorization
✅ Cosine similarity matching
✅ Fast article search
✅ CORS enabled for frontend
✅ Error handling & validation

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

Output: `frontend/dist/`

### Backend Deployment
For production, set `debug=False` in `app.py`:
```python
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
```

## Troubleshooting

### Issue: "Module not found" errors in backend
**Solution**: Ensure you're in the correct directory and have installed all requirements:
```bash
pip install -r requirements.txt
```

### Issue: CORS errors
**Solution**: Backend has CORS enabled. Ensure it's running on `http://localhost:5000`

### Issue: Articles not loading
**Solution**: Check that `data/processed/articles_processed.csv` exists and has the correct columns

### Issue: Frontend won't start
**Solution**: Ensure Node.js is installed and all dependencies are installed:
```bash
npm install
```

## Development Tips

### Adding New Features
1. **Backend**: Add new endpoints in `app.py`
2. **Frontend**: Create components in `src/components/`
3. **API**: Update `src/utils/api.js` with new API calls

### Testing
- Check browser console for frontend errors
- Check terminal for backend errors
- Use `curl` or Postman to test API endpoints

## Performance Notes

- TF-IDF model trains on initial data load (~1-2 seconds)
- Recommendations are computed in real-time
- Cosine similarity is calculated efficiently using scikit-learn
- Frontend caches user interests in localStorage

## Future Enhancements

- [ ] Advanced filtering options
- [ ] User history tracking
- [ ] Personalized recommendations based on reading patterns
- [ ] Article bookmarking
- [ ] Social sharing features
- [ ] Multiple language support
- [ ] ML model versioning

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review console logs (browser and terminal)
3. Verify all dependencies are installed
4. Ensure both servers are running

---

**Last Updated**: January 28, 2026
