import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getPublishers } from '../../api/client'
import LoadingSpinner from '../LoadingSpinner'

const COLORS = ['#a855f7','#8b5cf6','#7c3aed','#6d28d9','#5b21b6','#4c1d95','#9333ea','#c084fc','#e879f9','#f0abfc']

/**
 * Renders the top publishers by total global sales.
 * @returns {JSX.Element}
 */
export default function TopPublishers() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublishers(10)
      .then(pubs => {
        const sorted = [...pubs]
          .sort((a, b) => b.totalSales - a.totalSales)
          .map(p => ({ publisher: p.name, total_sales: p.totalSales, totalGames: p.totalGames }))
        setData(sorted)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <h2 className="text-lg font-semibold mb-1 text-gray-100">Top 10 publishers</h2>
      <p className="text-xs text-gray-500 mb-4">Total global försäljning i miljoner</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis dataKey="publisher" tick={{ fill: '#9ca3af', fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={v => `${v.toFixed(0)}M`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8 }}
            formatter={(v, _, props) => [`${v.toFixed(1)}M total · ${props.payload.totalGames} spel`, '']}
          />
          <Bar dataKey="total_sales" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
