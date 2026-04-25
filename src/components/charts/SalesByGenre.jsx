import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getGenres } from '../../api/client'
import LoadingSpinner from '../LoadingSpinner'

/** @type {string[]} Purple color palette for bar chart cells */
const COLORS = ['#a855f7','#8b5cf6','#7c3aed','#6d28d9','#5b21b6','#4c1d95','#9333ea','#c084fc','#e879f9','#f0abfc']

/**
 * Displays a horizontal bar chart of average global sales per game, grouped by genre.
 * Fetches genre data on mount, sorts by average sales descending, and renders
 * each genre as a colored bar with a tooltip showing sale average and game count.
 *
 * @component
 * @returns {JSX.Element} A bar chart card, or a loading spinner while data is being fetched.
 */
export default function SalesByGenre() {
  /**
   * @type {[Array<{genre: string, total_sales: number, totalGames: number}>, Function]}
   */
  const [data, setData] = useState([])

  /** @type {[boolean, Function]} */
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGenres()
      .then(genres => {
        const sorted = [...genres]
          .sort((a, b) => b.averageSales - a.averageSales)
          .map(g => ({ genre: g.name, total_sales: g.averageSales, totalGames: g.totalGames }))
        setData(sorted)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <h2 className="text-lg font-semibold mb-1 text-gray-100">Snittförsäljning per genre (M)</h2>
      <p className="text-xs text-gray-500 mb-4">Genomsnittlig global försäljning per spel</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={v => `${v.toFixed(2)}M`} />
          <YAxis dataKey="genre" type="category" tick={{ fill: '#9ca3af', fontSize: 12 }} width={90} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8 }}
            labelStyle={{ color: '#fff' }}
            /**
             * Custom tooltip formatter showing average sales and total game count.
             * @param {number} v - The sales value for the hovered bar.
             * @param {string} _ - The data key name (unused).
             * @param {{ payload: { totalGames: number } }} props - Recharts tooltip props.
             * @returns {[string, string]} Formatted label and empty series name.
             */
            formatter={(v, _, props) => [`${v.toFixed(3)}M snitt · ${props.payload.totalGames} spel`, '']}
          />
          <Bar dataKey="total_sales" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
