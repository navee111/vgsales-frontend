import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import GamesTable from './pages/GamesTable'
import LoginPage from './components/LoginPage'

/**
 * Reads auth related query params/localStorage once on app startup.
 * @returns {{ user: { name: string, email: string | null } | null, authError: string | null }}
 */
function getInitialAuthState() {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  const name = params.get('name')
  const email = params.get('email')
  const authErrorParam = params.get('error')

  if (token && name) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify({ name, email }))
    window.history.replaceState({}, '', '/')
    return { user: { name, email }, authError: null }
  }

  if (authErrorParam) {
    window.history.replaceState({}, '', '/')
    return { user: null, authError: authErrorParam }
  }

  const stored = localStorage.getItem('user')
  if (!stored) {
    return { user: null, authError: null }
  }

  try {
    return { user: JSON.parse(stored), authError: null }
  } catch {
    localStorage.removeItem('user')
    return { user: null, authError: null }
  }
}

/**
 * Root application component handling auth state and route setup.
 * @returns {JSX.Element}
 */
export default function App() {
  const [{ user, authError }, setAuthState] = useState(getInitialAuthState)

  /**
   * Clears auth state and token from localStorage.
   * @returns {void}
   */
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuthState({ user: null, authError: null })
  }

  if (!user) return <LoginPage authError={authError} />

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
