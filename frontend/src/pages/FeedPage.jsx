import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getRecommendations,
  searchArticles,
  shuffleArray,
  getAllArticles,
  getArticlesByCategory,
  getArticle,
} from '@/utils/api';
import { Header } from '@/components/Header';
import { ArticleGrid } from '@/components/ArticleGrid';

const INTERESTS_KEY = 'article-ai-interests';

// Map frontend interest IDs to backend category values
const INTEREST_MAP = {
  'technology': 'tech',
  'sports': 'sport',
  'sport': 'sport',
  'entertainment': 'entertainment',
  'business': 'business',
  'politics': 'politics',
};

// Read saved interests once (outside component so it's synchronous on mount)
const getSavedInterests = () => {
  try {
    const saved = localStorage.getItem(INTERESTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export default function FeedPage() {
  const navigate = useNavigate();
  const [interests, setInterests] = useState(getSavedInterests());
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Define fetchArticlesByInterests BEFORE any useEffect that uses it ────────
  const fetchArticlesByInterests = useCallback(async (selectedInterests) => {
    if (!selectedInterests || selectedInterests.length === 0) {
      return await getAllArticles(50);
    }

    const allArticles = [];
    const articlesPerInterest = 0;

    for (const interest of selectedInterests) {
      try {
        const category = INTEREST_MAP[interest] || interest;
        const articles = await getArticlesByCategory(category, articlesPerInterest);
        if (articles.length > 0) {
          allArticles.push(...articles);
        }
      } catch (err) {
        console.error(`Error fetching for interest ${interest}: `, err);
      }
    }

    if (allArticles.length === 0) {
      return await getAllArticles(50);
    }

    // Remove duplicates by article_id
    const seen = new Set();
    return allArticles.filter(article => {
      const id = article.article_id || article.id;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [interests]);

  // Removed unused sessionStorage logic for 'openArticle'

  // ── Fetch articles when interests change ─────────────────────────────────────
  useEffect(() => {
    if (interests && interests.length > 0) {
      console.log('Fetching articles for interests:', interests);
      setLoading(true);
      fetchArticlesByInterests(interests)
        .then(articles => {
          console.log('Fetched articles:', articles.length);
          setDisplayedArticles(shuffleArray(articles));
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching articles:', err);
          setLoading(false);
        });
    } else {
      setLoading(true);
      getAllArticles(50)
        .then(articles => {
          setDisplayedArticles(shuffleArray(articles));
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [interests, fetchArticlesByInterests]);

  // Removed recommendations fetching logic since FeedPage no longer renders ArticleView

  const handleChangeInterests = useCallback(() => {
    localStorage.removeItem(INTERESTS_KEY);
    navigate('/');
  }, [navigate]);

  const handleRefresh = useCallback(async () => {
    setIsSearchMode(false);
    setLoading(true);
    try {
      const articles = await fetchArticlesByInterests(interests);
      setDisplayedArticles(shuffleArray(articles));
    } catch (err) {
      console.error('Error refreshing articles:', err);
    } finally {
      setLoading(false);
    }
  }, [interests, fetchArticlesByInterests]);

  const handleSearch = useCallback(async (query) => {
    if (!query) {
      setIsSearchMode(false);
      setSearchQuery('');
      setLoading(true);
      try {
        const articles = await fetchArticlesByInterests(interests);
        setDisplayedArticles(shuffleArray(articles));
      } catch (err) {
        console.error('Error restoring feed:', err);
      } finally {
        setLoading(false);
      }
      return;
    }
    setSearchQuery(query);
    setIsSearchMode(true);
    setIsSearching(true);
    try {
      const results = await searchArticles(query, 0);
      const q = query.toLowerCase();
      const scored = results.map(a => {
        const titleMatch = (a.title || '').toLowerCase().includes(q) ? 2 : 0;
        const excerptMatch = (a.excerpt || a.content_preview || '').toLowerCase().includes(q) ? 1 : 0;
        return { ...a, _score: titleMatch + excerptMatch };
      });
      scored.sort((a, b) => b._score - a._score);
      setDisplayedArticles(scored);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, [interests, fetchArticlesByInterests]);

  const handleSelectArticle = useCallback((article) => {
    const articleId = article.article_id || article.id;
    navigate(`/article/${articleId}`, { state: { article } });
  }, [navigate]);

  // ── Render ───────────────────────────────────────────────────────────────────

  // Loading spinner (first load only)
  if (loading && displayedArticles.length === 0) {
    return (
      <div className="min-h-screen bg-[#F0F4F3] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-[#5C8374]/20" />
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-[#5C8374] animate-spin" />
          </div>
          <p className="text-[#183D3D] font-semibold text-lg">Loading articles...</p>
          <p className="text-[#183D3D]/60 text-sm mt-2">Curating content just for you</p>
        </div>
      </div>
    );
  }

  // Removed inline ArticleView rendering

  // Main article grid
  return (
    <div className="min-h-screen bg-[#F0F4F3]">
      <Header
        interests={interests}
        onChangeInterests={handleChangeInterests}
        onRefresh={handleRefresh}
        onSearch={handleSearch}
        isSearching={isSearching}
      />
      {isSearchMode && displayedArticles.length === 0 && !isSearching && (
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl font-semibold text-[#183D3D]">No results found</p>
          <p className="text-[#183D3D]/60 mt-2">Try a different search term</p>
        </div>
      )}
      {(!isSearchMode || displayedArticles.length > 0) && (
        <ArticleGrid
          articles={displayedArticles}
          onSelectArticle={handleSelectArticle}
          loading={loading || isSearching}
          highlightQuery={isSearchMode ? searchQuery : ''}
        />
      )}
    </div>
  );
}
