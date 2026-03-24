import { Routes, Route } from 'react-router-dom'
import InterestPage from './pages/InterestPage'
import FeedPage from './pages/FeedPage'
import BookmarksPage from './pages/BookmarksPage'
import AdminPage from './pages/AdminPage'
import ArticleViewPage from './pages/ArticleViewPage'
import SearchPage from './pages/SearchPage'
import DiscoverPage from './pages/DiscoverPage'
import CategoryPage from './pages/CategoryPage'

const App = () => (
  <Routes>
    <Route path="/" element={<InterestPage />} />
    <Route path="/bookmarks" element={<BookmarksPage />} />
    <Route path="/admin" element={<AdminPage />} />
    <Route path="/article" element={<FeedPage />} />
    <Route path="/article/:id" element={<ArticleViewPage />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="/discover" element={<DiscoverPage />} />
    <Route path="/category/:id" element={<CategoryPage />} />
  </Routes>
)

export default App
