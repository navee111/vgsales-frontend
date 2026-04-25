import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { getGames } from '../../api/client'
import LoadingSpinner from '../LoadingSpinner'

/** @type {string[]} Color palette for pie chart slices */
const COLORS = ['#a855f7','#8b5cf6','#6d28d9','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444']

/**
 * Displays a pie chart of the top 8 platforms by total global game sales.
 * Fetches up to 500 games on mount, aggregates sales by platform, sorts
 * descending, and renders the top 8 as labeled pie slices.
 *
 * @component
 * @returns {JSX.Element} A pie chart card, or a loading spinner while data is being fetched.
 */
export default function SalesByPlatform() {
  /**
   * @type {[Array<{platform: string, total_sales: number}>, Function]}
   */
  const [data, setData] = useState([])

  /** @type {[boolean, Function]} */
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGames({ limit: 500 })
      .then(games => {
        /** @type {Record<string, number>} Accumulator mapping platform name to summed global sales */
        const byPlatform = {}
        games.forEach(g => {
          byPlatform[g.platform] = (byPlatform[g.platform] || 0) + (g.globalSales || 0)
        })
        const sorted = Object.entries(byPlatform)
          .map(([platform, total_sales]) => ({ platform, total_sales: Number(total_sales.toFixed(2)) }))
          .sort((a, b) => b.total_sales - a.total_sales)
          .slice(0, 8)
        setData(sorted)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <h2 className="text-lg font-semibold mb-1 text-gray-100">Top 8 plattformar</h2>
      <p className="text-xs text-gray-500 mb-4">Andel av global försäljning</p>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total_sales"
            nameKey="platform"
            cx="50%" cy="50%"
            outerRadius={100}
            /**
             * Custom slice label showing platform name and percentage share.
             * @param {{ platform: string, percent: number }} props - Recharts label props.
             * @returns {string} Formatted label string.
             */
            label={({ platform, percent }) => `${platform} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8 }}
            /**
             * Custom tooltip formatter showing sales in millions.
             * @param {number} v - The sales value for the hovered slice.
             * @returns {[string, string]} Formatted value and series label.
             */
            formatter={v => [`${v.toFixed(1)}M`, 'Försäljning']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
