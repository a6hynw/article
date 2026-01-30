import { useState, useEffect, useCallback } from 'react';
import {
  getRecommendations,
  searchArticles,
  shuffleArray,
  getAllArticles,
} from '@/utils/api';
import { InterestSelector } from '@/components/InterestSelector';
import { Header } from '@/components/Header';
import { ArticleGrid } from '@/components/ArticleGrid';
import { ArticleView } from '@/components/ArticleView';

const INTERESTS_KEY = 'article-ai-interests';

const Index = () => {
  const [interests, setInterests] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load interests from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(INTERESTS_KEY);
    if (saved) {
      setInterests(JSON.parse(saved));
    } else {
      setInterests([]);
    }
  }, []);

  // Fetch articles when interests change
  useEffect(() => {
    if (interests && interests.length > 0) {
      setLoading(true);
      fetchArticlesByInterests(interests)
        .then(articles => {
          setDisplayedArticles(shuffleArray(articles));
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching articles:', err);
          setLoading(false);
        });
    }
  }, [interests]);

  // Fetch recommendations when article is selected
  useEffect(() => {
    if (selectedArticle) {
      setLoading(true);
      getRecommendations(selectedArticle.article_id || selectedArticle.id, 4)
        .then(recs => {
          setRecommendations(recs);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching recommendations:', err);
          setLoading(false);
        });
    }
  }, [selectedArticle]);

  const fetchArticlesByInterests = async (selectedInterests) => {
    // If no interests selected, get all articles
    if (!selectedInterests || selectedInterests.length === 0) {
      return await getAllArticles(20);
    }

    // Fetch articles for each interest using search
    const allArticles = [];
    for (const interest of selectedInterests) {
      try {
        const articles = await searchArticles(interest, 20);
        allArticles.push(...articles);
      } catch (err) {
        console.error(`Error fetching articles for ${interest}:`, err);
      }
    }

    // Remove duplicates by article_id
    const seen = new Set();
    return allArticles.filter(article => {
      const id = article.article_id || article.id;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
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
      setLoading(true);
      const articles = await fetchArticlesByInterests(interests);
      setDisplayedArticles(shuffleArray(articles));
      setLoading(false);
    }
  }, [interests]);

  const handleSelectArticle = useCallback((article) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = useCallback(() => {
    setSelectedArticle(null);
  }, []);

  // Loading state
  if (interests === null) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-pulse text-primary-foreground">
          Loading...
        </div>
      </div>
    );
  }

  // Interest selection
  if (interests.length === 0) {
    return <InterestSelector onComplete={handleInterestComplete} />;
  }

  // Loading articles
  if (loading && displayedArticles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-foreground">Loading articles...</p>
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
        onBack={handleBack}
        onSelectArticle={handleSelectArticle}
      />
    );
  }

  // Main article grid
  return (
    <div className="min-h-screen bg-background">
      <Header
        interests={interests}
        onChangeInterests={handleChangeInterests}
        onRefresh={handleRefresh}
      />
      <ArticleGrid
        articles={displayedArticles}
        onSelectArticle={handleSelectArticle}
        loading={loading}
      />
    </div>
  );
};

export default Index;
