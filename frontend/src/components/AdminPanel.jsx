import { useState, useEffect } from 'react'
import { ArrowLeft, Plus, Trash2, BarChart3, FileText, Tag } from 'lucide-react'
import { Button } from './ui/button'
import { getAdminStats, addArticle, deleteArticle, getAllArticles } from '@/utils/api'

export function AdminPanel({ onBack }) {
  const [stats, setStats] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'general'
  })

  // when stats load, default category should be first available
  useEffect(() => {
    if (stats && stats.categories) {
      const cats = Object.keys(stats.categories);
      if (cats.length > 0) {
        setNewArticle(prev => ({ ...prev, category: cats[0] }));
      }
    }
  }, [stats]);

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsData, articlesData] = await Promise.all([
        getAdminStats(),
        getAllArticles(0) // Get all articles
      ])
      setStats(statsData)
      setArticles(articlesData)
    } catch (error) {
      console.error('Error loading admin data:', error)
    }
    setLoading(false)
  }

  const handleAddArticle = async (e) => {
    e.preventDefault()
    try {
      await addArticle(newArticle)
      setNewArticle({ title: '', content: '', summary: '', category: 'general' })
      setShowAddForm(false)
      loadData() // Refresh data
    } catch (error) {
      alert('Error adding article: ' + error.message)
    }
  }

  const handleDeleteArticle = async (articleId) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    try {
      await deleteArticle(articleId)
      loadData() // Refresh data
    } catch (error) {
      alert('Error deleting article: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F4F3] flex items-center justify-center">
        <div className="text-[#183D3D]">Loading admin panel...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0F4F3]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F0F4F3]/80 backdrop-blur-xl border-b border-[#5C8374]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#5C8374]/10 transition-all duration-300 font-semibold text-[#183D3D]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Articles
          </button>

          <h1 className="text-xl font-bold text-[#183D3D]">Admin Panel</h1>

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#5C8374] text-white rounded-lg hover:bg-[#183D3D] transition-all duration-300 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Article
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#5C8374]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#5C8374]/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#5C8374]" />
                </div>
                <div>
                  <p className="text-sm text-[#183D3D]/60">Total Articles</p>
                  <p className="text-2xl font-bold text-[#183D3D]">{stats.total_articles}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#5C8374]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#5C8374]/10 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-[#5C8374]" />
                </div>
                <div>
                  <p className="text-sm text-[#183D3D]/60">Categories</p>
                  <p className="text-2xl font-bold text-[#183D3D]">{Object.keys(stats.categories).length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#5C8374]/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#5C8374]/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-[#5C8374]" />
                </div>
                <div>
                  <p className="text-sm text-[#183D3D]/60">Most Common</p>
                  <p className="text-lg font-bold text-[#183D3D]">
                    {Object.keys(stats.categories).length > 0
                      ? Object.entries(stats.categories).reduce((a, b) => stats.categories[a[0]] > stats.categories[b[0]] ? a : b)[0]
                      : 'None'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Management */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#5C8374]/20">
          <h2 className="text-xl font-bold text-[#183D3D] mb-6">Articles Management</h2>

          <div className="space-y-4">
            {articles.map((article) => (
              <div key={article.id} className="flex items-center justify-between p-4 bg-[#F0F4F3]/50 rounded-lg border border-[#5C8374]/10">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#183D3D] mb-1">{article.title}</h3>
                  <p className="text-sm text-[#183D3D]/60">ID: {article.id} | Category: {article.category}</p>
                </div>
                <button
                  onClick={() => handleDeleteArticle(article.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Delete article"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Article Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#183D3D] mb-6">Add New Article</h2>

            <form onSubmit={handleAddArticle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#183D3D] mb-2">Title</label>
                <input
                  type="text"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                  placeholder="Enter article title…"
                  className="w-full p-3 border border-[#5C8374]/20 rounded-lg focus:ring-2 focus:ring-[#5C8374] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#183D3D] mb-2">Content</label>
                <textarea
                  value={newArticle.content}
                  onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                  className="w-full p-3 border border-[#5C8374]/20 rounded-lg focus:ring-2 focus:ring-[#5C8374] focus:border-transparent"
                  rows={6}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#183D3D] mb-2">Summary</label>
                <textarea
                  value={newArticle.summary}
                  onChange={(e) => setNewArticle({...newArticle, summary: e.target.value})}
                  className="w-full p-3 border border-[#5C8374]/20 rounded-lg focus:ring-2 focus:ring-[#5C8374] focus:border-transparent"
                  rows={3}
                />
              </div>

                      <div>
                <label className="block text-sm font-medium text-[#183D3D] mb-2">Category</label>
                <select
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                  className="w-full p-3 border border-[#5C8374]/20 rounded-lg focus:ring-2 focus:ring-[#5C8374] focus:border-transparent"
                >
                  {(stats && stats.categories)
                    ? Object.keys(stats.categories).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                    : <option value="general">general</option>
                  }
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#5C8374] text-white hover:bg-[#183D3D]"
                >
                  Add Article
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}