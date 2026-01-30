const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// Fetch recommendations from Python backend
export async function getRecommendations(articleId, topN = 5) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/recommendations/${articleId}?top_n=${topN}`
    )
    if (!response.ok) throw new Error('Failed to fetch recommendations')
    return await response.json()
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return []
  }
}

// Search articles from Python backend
export async function searchArticles(query, topN = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, top_n: topN })
    })
    if (!response.ok) throw new Error('Failed to search articles')
    return await response.json()
  } catch (error) {
    console.error('Error searching articles:', error)
    return []
  }
}

// Fetch all articles
export async function getAllArticles(limit = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles?limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch articles')
    return await response.json()
  } catch (error) {
    console.error('Error fetching articles:', error)
    return []
  }
}

// Fetch single article
export async function getArticle(articleId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/article/${articleId}`)
    if (!response.ok) throw new Error('Article not found')
    return await response.json()
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

// Shuffle an array
export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
