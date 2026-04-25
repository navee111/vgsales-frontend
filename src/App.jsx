import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./components/LoginPage"
import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import GameTable from "./pages/GamesTable"

/**
 * Root application component handling auth state and route setup.
 * @returns {JSX.Element}
 */
export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  })

  /**
   * Persists the logged-in user and token in local storage.
   * @param {{ name?: string, email?: string, picture?: string, token?: string }} userData
   * @returns {void}
   */
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", userData || "")
    setUser(userData)
  }

  /**
   * Clears auth state and forces a navigation back to root.
   * @returns {void}
   */
  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    window.location.href = '/'
  }
   
  if (!user) return <LoginPage onLogin={handleLogin}/>
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar user={user} onLogout={handleLogout}/>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/games" element={<GameTable />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}



