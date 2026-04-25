import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import GamesTable from './pages/GamesTable'
import LoginPage from './components/LoginPage'

/**
 * Root application component handling auth state and route setup.
 * Fetches session from backend on mount and manages logout.
 * @returns {JSX.Element}
 */
export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://wonderful-flexibility-production-e850.up.railway.app/auth/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setUser(data.user)
          localStorage.setItem('token', data.token)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  /**
   * Clears session on backend and removes token from localStorage.
   * @returns {void}
   */
  const handleLogout = async () => {
    await fetch('https://wonderful-flexibility-production-e850.up.railway.app/auth/logout', { method: 'POST', credentials: 'include' })
    localStorage.removeItem('token')
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
 