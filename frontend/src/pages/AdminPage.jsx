import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminPanel } from '@/components/AdminPanel'

export default function AdminPage() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    // Basic frontend gate matching the default VITE_ADMIN_TOKEN
    const validPassword = import.meta.env.VITE_ADMIN_TOKEN || 'admin123'
    if (password === validPassword) {
      setIsAuthenticated(true)
    } else {
      setError('Incorrect password')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F0F4F3] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full border border-[#5C8374]/20">
          <h2 className="text-2xl font-bold text-[#183D3D] mb-6 text-center" style={{ fontFamily: 'Georgia, serif' }}>Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full p-3 border border-[#5C8374]/20 rounded-lg focus:ring-2 focus:ring-[#5C8374] focus:border-transparent"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-[#5C8374] text-white rounded-lg font-semibold hover:bg-[#183D3D] transition-colors"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate('/article')}
              className="w-full py-3 mt-2 bg-gray-100 text-[#183D3D] rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Navigate to the article feed, not the interest selector
  return <AdminPanel onBack={() => navigate('/article')} />
}
