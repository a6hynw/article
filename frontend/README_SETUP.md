# Beautiful Article Recommender System

A modern, responsive web application for discovering and recommending articles using TF-IDF similarity matching.

## 🎨 Features

✨ **Beautiful Modern UI**
- Gradient header with smooth animations
- Responsive card-based layout
- Interactive modals for full article viewing
- Dark-themed search bar
- Loading spinners and error handling

📚 **Automatic Default Articles**
- Loads 10 articles automatically on page load
- No need to search initially - articles display immediately
- Clean, card-based presentation

🔍 **Full Article Details**
- Click "View Full Article" to open a modal
- Read complete article content
- View article metadata and summary
- Beautiful typography and formatting

💡 **Smart Recommendations**
- Click "Get Recommendations" on any article
- View similar articles based on TF-IDF similarity
- Shows matching score for each recommendation
- Easy navigation between recommendations and articles

🔎 **Smart Search**
- Search by keywords or article ID
- Intelligent parsing (numbers treated as IDs, text as keywords)
- Displays results instantly

## 🚀 Quick Start

### 1. Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies
```bash
cd templates
npm install
```

### 3. Start the Backend
```bash
python app.py
```
The Flask API will run on `http://localhost:5000`

### 4. Start the Frontend (in a new terminal)
```bash
cd templates
npm run dev
```
The Vite dev server will run on `http://localhost:5173`

## 📋 API Endpoints

### Get Default Articles
```
GET /api/articles?limit=10
```
Returns a list of articles

### Get Specific Article
```
GET /api/article/<article_id>
```
Returns full details of an article

### Get Recommendations
```
GET /api/recommendations/<article_id>?top_n=10
```
Returns similar articles based on TF-IDF similarity

### Search Articles
```
POST /api/search
Content-Type: application/json

{
  "query": "your search text",
  "top_n": 10
}
```

## 🎯 User Workflow

1. **Open the App** → Automatically loads 10 random articles
2. **Browse Articles** → Scroll through article cards
3. **View Details** → Click "View Full Article" to see complete content
4. **Get Recommendations** → Click "Get Recommendations" to find similar articles
5. **Search** → Use search bar to find specific articles or topics
6. **Back to Articles** → Click "Back to Articles" to return to main view

## 🎨 Design Features

- **Color Scheme**: Blue (#3b82f6) and Purple (#8b5cf6) gradients
- **Spacing**: Consistent padding and margins with Tailwind-inspired spacing
- **Shadows**: Subtle box shadows for depth
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design that works on all screen sizes
- **Typography**: Clean, readable font with proper hierarchy

## 📱 Responsive Design

- Desktop: 3 columns in article grid
- Tablet: 2 columns
- Mobile: 1 column (full width)

## 🛠️ Tech Stack

**Backend**
- Flask (Python)
- Pandas for data processing
- Scikit-learn for TF-IDF vectorization
- Flask-CORS for cross-origin requests

**Frontend**
- React 19.2
- Vite 7.2 (build tool)
- CSS3 with custom properties (CSS variables)
- Modern JavaScript (ES6+)

## 📝 Customization

### Change Default Articles Count
Edit in `app.py`:
```python
limit = request.args.get('limit', default=10, type=int)
```

### Change Color Scheme
Edit CSS variables in `templates/src/App.css`:
```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* ... */
}
```

### Adjust Grid Layout
Edit in `templates/src/App.css`:
```css
.articles-grid {
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}
```

## 🐛 Troubleshooting

**CORS Errors?**
- Make sure Flask is running on port 5000
- Backend already has Flask-CORS enabled

**API not responding?**
- Check that both frontend and backend are running
- Verify Flask app is on http://localhost:5000

**Missing articles?**
- Ensure `data/processed/articles_processed.csv` exists
- Run the preprocessing pipeline if needed

## 📄 File Structure

```
article/
├── app.py (Flask backend with API endpoints)
├── requirements.txt
├── templates/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx (Main component)
│   │   ├── App.css (Main styling)
│   │   ├── index.css (Global styles)
│   │   ├── main.jsx
│   │   └── components/
│   │       ├── ArticleCard.jsx
│   │       ├── ArticleCard.css
│   │       ├── ArticleModal.jsx
│   │       ├── ArticleModal.css
│   │       ├── SearchBar.jsx
│   │       ├── SearchBar.css
│   │       ├── LoadingSpinner.jsx
│   │       └── LoadingSpinner.css
```

## 🎓 How It Works

1. **Backend Load** → Flask loads processed articles from CSV
2. **Initialize** → TF-IDF model trains on article content
3. **Frontend Load** → React fetches first 10 articles via API
4. **User Interaction** → Click article for details or recommendations
5. **Similarity Search** → TF-IDF compares content and ranks similar articles

---

Made with ❤️ for discovering great articles
