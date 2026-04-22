import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getGenres } from '../../api/client'
import LoadingSpinner from '../LoadingSpinner'

const COLORS = ['#a855f7','#8b5cf6','#7c3aed','#6d28d9','#5b21b6','#4c1d95','#9333ea','#c084fc','#e879f9','#f0abfc']

export default function SalesByGenre() {
  const [data, setData] = useState([])
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
