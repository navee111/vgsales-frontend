/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react'
import { getGames } from '../api/client'
import FilterBar from '../components/filters/FilterBar'
import LoadingSpinner from '../components/LoadingSpinner'

/**
 * Renders the paginated games table with filter controls.
 * @returns {JSX.Element}
 */
export default function GamesTable() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(2)
  const [filters, setFilters] = useState({ search: '', genre: '', platform: '' })

  /**
   * Fetches games for the current page and active filters.
   * @returns {Promise<void>}
   */
  const fetchGames = useCallback(async () => {
    //setLoading(true)
    try {
      const results = await getGames({
        platform: filters.platform || undefined,
        genre: filters.genre || undefined,
        limit: 50,
        offset: (page - 1) * 50,
      })
      setGames(results)
      if (results.length < 50) setTotalPages(page)
      else setTotalPages(page + 1)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [page, filters]) 

  useEffect(() => { 
    setLoading (true)
    fetchGames() }, [fetchGames])

  /**
   * Updates filters and resets pagination to the first page.
   * @param {{ search: string, genre: string, platform: string }} newFilters
   * @returns {void}
   */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Alla spel</h1>
      <FilterBar filters={filters} onChange={handleFilterChange} />
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                <tr>
                  {['Namn','Platform','År','Genre','Publisher','NA (M)','EU (M)','JP (M)','Global (M)'].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {games.map((g, i) => (
                  <tr key={g.id || i} className="border-t border-gray-800 hover:bg-gray-800/50 transition">
                    <td className="px-4 py-3 font-medium text-white">{g.name}</td>
                    <td className="px-4 py-3 text-purple-400">{g.platform}</td>
                    <td className="px-4 py-3 text-gray-400">{g.year || '—'}</td>
                    <td className="px-4 py-3 text-gray-400">{g.genre}</td>
                    <td className="px-4 py-3 text-gray-400">{g.publisher}</td>
                    <td className="px-4 py-3 text-green-400">{g.naSales?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-blue-400">{g.euSales?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-yellow-400">{g.jpSales?.toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold text-white">{g.globalSales?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
            <span>Sida {page} av {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-30 hover:bg-gray-700 transition">
                ← Föregående
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 bg-gray-800 rounded-lg disabled:opacity-30 hover:bg-gray-700 transition">
                Nästa →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
