import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  const { pathname } = useLocation()

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold text-purple-400">Video Gams Sales</span>
        <Link
          to="/"
          className={`text-sm font-medium ${pathname === '/' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Dashboard
        </Link>
        <Link
          to="/games"
          className={`text-sm font-medium ${pathname === '/games' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
        >
          Alla spel
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <img src={user.picture} className="w-8 h-8 rounded-full" />
        <span className="text-sm text-gray-300">{user.name}</span>
        <button
          onClick={onLogout}
          className="text-sm text-gray-500 hover:text-red-400 transition ml-2"
        >
          Logga ut
        </button>
      </div>
    </nav>
  )
}