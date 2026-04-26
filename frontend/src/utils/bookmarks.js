// Centralized bookmark management utilities
export const BOOKMARKS_KEY = 'article-ai-bookmarks'

export function getBookmarkIds() {
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveBookmarks(ids) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids))
}

export function toggleBookmark(articleId) {
  const ids = getBookmarkIds()
  const updated = ids.includes(articleId)
    ? ids.filter(id => id !== articleId)
    : [...ids, articleId]
  saveBookmarks(updated)
  return updated
}

export function isBookmarked(articleId) {
  return getBookmarkIds().includes(articleId)
}
