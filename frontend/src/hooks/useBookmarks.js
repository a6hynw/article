import { useState, useCallback, useEffect } from 'react'

const BOOKMARKS_KEY = 'article-ai-bookmarks'

export function useBookmarks() {
  const getBookmarkIds = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]')
    } catch {
      return []
    }
  }, [])

  const [bookmarkIds, setBookmarkIds] = useState(getBookmarkIds)

  // Listen to custom event for cross-component sync
  useEffect(() => {
    const handleUpdate = () => setBookmarkIds(getBookmarkIds())
    window.addEventListener('bookmarksUpdated', handleUpdate)
    return () => window.removeEventListener('bookmarksUpdated', handleUpdate)
  }, [getBookmarkIds])

  const toggleBookmark = useCallback((articleId) => {
    setBookmarkIds(prev => {
      const updated = prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated))
      window.dispatchEvent(new Event('bookmarksUpdated'))
      return updated
    })
  }, [])

  const isBookmarked = useCallback((articleId) => {
    return bookmarkIds.includes(articleId)
  }, [bookmarkIds])

  const saveBookmarks = useCallback((ids) => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids))
    setBookmarkIds(ids)
    window.dispatchEvent(new Event('bookmarksUpdated'))
  }, [])

  return {
    bookmarkIds,
    toggleBookmark,
    isBookmarked,
    saveBookmarks,
    setBookmarkIds
  }
}
