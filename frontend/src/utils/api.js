const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// Helper function to create fetch with timeout
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}

// Fetch recommendations from Python backend
export async function getRecommendations(articleId, topN = 5) {
  try {
    if (!articleId || articleId === 'undefined' || articleId === 'null') {
      console.warn('Invalid articleId provided to getRecommendations:', articleId)
      return []
    }

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/recommendations/${articleId}?top_n=${topN}`
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch recommendations: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return []
  }
}

// Search articles from Python backend
export async function searchArticles(query, topN = 10) {
  try {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      console.warn('Invalid query provided to searchArticles:', query)
      return []
    }

    const response = await fetchWithTimeout(`${API_BASE_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: query.trim(),
        top_n: topN
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to search articles: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error searching articles:', error)
    return []
  }
}

// Fetch all articles
export async function getAllArticles(limit = 10) {
  try {
    // Allow limit 0 (all) and larger limits
    if (limit < 0) {
      console.warn('Invalid limit provided to getAllArticles:', limit)
      limit = 10
    }

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/articles?limit=${limit}`
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

// Fetch articles by category
export async function getArticlesByCategory(category, limit = 10) {
  try {
    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      console.warn('Invalid category provided:', category)
      return []
    }

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/articles?category=${encodeURIComponent(category)}&limit=${limit}`
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch articles by category: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching articles by category:', error)
    return []
  }
}

// Fetch all articles
export async function getArticle(articleId) {
  try {
    if (!articleId || articleId === 'undefined' || articleId === 'null') {
      console.warn('Invalid articleId provided to getArticle:', articleId)
      return null
    }

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/article/${articleId}`
    )

    if (!response.ok) {
      if (response.status === 404) {
        console.warn('Article not found:', articleId)
        return null
      }
      const errorText = await response.text()
      throw new Error(`Failed to fetch article: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

// Shuffle an array
export function shuffleArray(array) {
  if (!Array.isArray(array)) {
    console.warn('Invalid array provided to shuffleArray:', array)
    return []
  }

  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
