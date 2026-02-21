
import { useState, useEffect, useCallback } from 'react';
import {
  getRecommendations,
  searchArticles,
  shuffleArray,
  getAllArticles,
  getArticlesByCategory,
  getArticle,
} from '@/utils/api';
import { InterestSelector } from '@/components/InterestSelector';
import { Header } from '@/components/Header';
import { ArticleGrid } from '@/components/ArticleGrid';
import { ArticleView } from '@/components/ArticleView';

const INTERESTS_KEY = 'article-ai-interests';

// Read saved interests once (outside component so it's synchronous on mount)
const getSavedInterests = () => {
  try {
    const saved = localStorage.getItem(INTERESTS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const Index = () => {
  // Always start on the interest selector — load saved interests only as defaults
  const [interests, setInterests] = useState(null);  // null = not yet selected this session
  const [savedInterests] = useState(getSavedInterests);  // pre-tick previous choices
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recsLoading, setRecsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch articles when interests change
  useEffect(() => {
    if (interests && interests.length > 0) {
      console.log('Fetching articles for interests:', interests)
      setLoading(true);
      fetchArticlesByInterests(interests)
        .then(articles => {
          console.log('Fetched articles:', articles.length)
          setDisplayedArticles(shuffleArray(articles));
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching articles:', err);
          setLoading(false);
        });
    } else {
      console.log('No interests selected, showing empty state')
    }
  }, [interests]);

  // Fetch recommendations when article is selected
  useEffect(() => {
    if (selectedArticle) {
      setRecommendations([]);  // clear stale recs immediately
      setRecsLoading(true);
      getRecommendations(selectedArticle.article_id || selectedArticle.id, 6)
        .then(recs => {
          setRecommendations(recs);
          setRecsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching recommendations:', err);
          setRecsLoading(false);
        });
    }
  }, [selectedArticle]);

  const fetchArticlesByInterests = async (selectedInterests) => {
    // If no interests selected, get all articles
    if (!selectedInterests || selectedInterests.length === 0) {
      console.log('No interests, fetching all articles')
      return await getAllArticles(0);
    }

    // Map interests to search terms
    const interestToTerms = {
      'tech': ['tech', 'technology', 'computer', 'software', 'digital', 'internet'],
      'business': ['business', 'company', 'market', 'economy', 'finance', 'corporate'],
      'health': ['health', 'medical', 'doctor', 'disease', 'treatment', 'wellness'],
      'science': ['science', 'research', 'study', 'discovery', 'scientific'],
      'entertainment': ['entertainment', 'movie', 'music', 'film', 'celebrity', 'show'],
      'sports': ['sport', 'game', 'player', 'team', 'match', 'athlete'],
      'politics': ['politics', 'government', 'political', 'election', 'policy'],
      'travel': ['travel', 'trip', 'destination', 'vacation', 'tourism']
    };

    // Fetch articles for each interest using search
    const allArticles = [];

    // Fetch all articles for each interest (limit=0 means all)
    const articlesPerInterest = 0;

    for (const interest of selectedInterests) {
      console.log(`Fetching all articles for interest: ${interest}`);

      try {
        // Map frontend interest ID to backend category ID
        // Frontend: tech, business, health, etc.
        // Backend: tech, business, sport, politics, entertainment
        // Note: 'technology' isn't a direct ID in constant.js (it is 'tech'), but let's handle potential mismatches

        let category = interest;
        // Simple mapping for safety, though IDs largely match
        const interestMap = {
          'technology': 'tech',
          'sports': 'sport',
          'entertainment': 'entertainment',
          'business': 'business',
          'politics': 'politics'
        };

        if (interestMap[interest]) {
          category = interestMap[interest];
        }

        // Use the new category filter endpoint
        const articles = await getArticlesByCategory(category, articlesPerInterest);
        console.log(`Found ${articles.length} articles for category ${category}`);

        if (articles.length > 0) {
          allArticles.push(...articles);
        } else {
          console.warn(`No articles found for category: ${category} `);
        }

      } catch (err) {
        console.error(`Error fetching for interest ${interest}: `, err);
      }
    }

    // If no articles found through search, fall back to all articles
    if (allArticles.length === 0) {
      console.log('No articles found through search, falling back to all articles')
      return await getAllArticles(0);
    }

    // Remove duplicates by article_id
    const seen = new Set();
    const uniqueArticles = allArticles.filter(article => {
      const id = article.article_id || article.id;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    console.log('Total unique articles:', uniqueArticles.length)
    return uniqueArticles;
  };

  const handleInterestComplete = useCallback((selected) => {
    setInterests(selected);
    localStorage.setItem(INTERESTS_KEY, JSON.stringify(selected));
  }, []);

  const handleChangeInterests = useCallback(() => {
    setInterests([]);
    localStorage.removeItem(INTERESTS_KEY);
    setSelectedArticle(null);
  }, []);

  const handleRefresh = useCallback(async () => {
    if (interests && interests.length > 0) {
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
    }
  }, [interests]);

  const handleSearch = useCallback(async (query) => {
    if (!query) {
      setIsSearchMode(false);
      setSearchQuery('');
      if (interests && interests.length > 0) {
        setLoading(true);
        try {
          const articles = await fetchArticlesByInterests(interests);
          setDisplayedArticles(shuffleArray(articles));
        } catch (err) {
          console.error('Error restoring feed:', err);
        } finally {
          setLoading(false);
        }
      }
      return;
    }
    setSearchQuery(query);
    setIsSearchMode(true);
    setIsSearching(true);
    try {
      // No limit — fetch all matching articles
      const results = await searchArticles(query, 0);

      // Sort: title matches first (score 2), then excerpt/content matches (score 1)
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
  }, [interests]);

  const handleSelectArticle = useCallback(async (article) => {
    // If the clicked item is a recommendation card it only has partial data.
    // Fetch the full article so ArticleView shows complete content.
    const articleId = article.article_id || article.id;
    if (articleId && !article.content) {
      try {
        const full = await getArticle(articleId);
        setSelectedArticle(full || article);
      } catch {
        setSelectedArticle(article);
      }
    } else {
      setSelectedArticle(article);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = useCallback(() => {
    setSelectedArticle(null);
    setRecommendations([]);   // clear stale recommendations when going back
  }, []);

  // Interest selection — always shown on fresh page load
  if (interests === null) {
    return (
      <InterestSelector
        defaultSelected={savedInterests}
        onComplete={handleInterestComplete}
      />
    );
  }

  // Loading articles
  if (loading && displayedArticles.length === 0) {
    return (
      <div className="min-h-screen bg-[#F0F4F3] flex items-center justify-center">
        <div className="text-center">
          {/* Custom spinner */}
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

  // Article detail view
  if (selectedArticle) {
    return (
      <ArticleView
        article={selectedArticle}
        recommendations={recommendations}
        recommendationsLoading={recsLoading}
        onBack={handleBack}
        onSelectArticle={handleSelectArticle}
      />
    );
  }

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
};

export default Index;