import { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getGames } from '../../api/client'
import LoadingSpinner from '../LoadingSpinner'

/**
 * Displays global game sales trend per year using a sampled games dataset.
 * @returns {JSX.Element}
 */
export default function SalesOverTime() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Hämta 500 spel och aggregera per år i frontend
    getGames({ limit: 500, offset: 0 })
      .then(games => {
        const byYear = {}
        games.forEach(g => {
          if (!g.year || g.year < 1990 || g.year > 2016) return
          byYear[g.year] = (byYear[g.year] || 0) + (g.globalSales || 0)
        })
        const sorted = Object.entries(byYear)
          .map(([year, total_sales]) => ({ year: Number(year), total_sales: Number(total_sales.toFixed(2)) }))
          .sort((a, b) => a.year - b.year)
        setData(sorted)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <h2 className="text-lg font-semibold mb-1 text-gray-100">Global försäljning över tid</h2>
      <p className="text-xs text-gray-500 mb-4">Baserat på urval av spel 1990–2016</p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="year" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={v => `${v}M`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8 }}
            formatter={v => [`${v}M`, 'Försäljning']}
          />
          <Area type="monotone" dataKey="total_sales" stroke="#a855f7" fill="url(#salesGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
