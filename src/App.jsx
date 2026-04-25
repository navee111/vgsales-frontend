import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import GamesTable from './pages/GamesTable'
import LoginPage from './components/LoginPage'

/**
 * Root application component handling auth state and route setup.
 * @returns {JSX.Element}
 */
export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Kolla om token finns i URL efter OAuth redirect
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const name = params.get('name')
    const email = params.get('email')

    if (token && name) {
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({ name, email }))
      setUser({ name, email })
      window.history.replaceState({}, '', '/')
      setLoading(false)
      return
    }

    // Annars kolla localStorage
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
      setLoading(false)
      return
    }

    setLoading(false)
  }, [])

  /**
   * Clears auth state and token from localStorage.
   * @returns {void}
   */
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (loading) return <div style={{ minHeight: '100vh', background: '#030712' }} />
  if (!user) return <LoginPage />

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/games" element={<GamesTable />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
