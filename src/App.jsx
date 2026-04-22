import { useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./components/LoginPage"
import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
import GameTable from "./pages/GamesTable"

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  })
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", userData || "")
    setUser(userData)
  }
  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
  }
   
  if (!user) return <LoginPage onLogin={handleLogin}/>
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar user={user} onLogin={handleLogout}/>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/games" element={<GameTable />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}



