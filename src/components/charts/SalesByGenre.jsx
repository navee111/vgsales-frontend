import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getSalesByGenre } from '../../api/client'
import LoadingSpinner from '../LoadingSpinner'

const COLORS = ['#a855f7','#8b5cf6','#7c3aed','#6d28d9','#5b21b6','#4c1d95','#9333ea','#c084fc','#e879f9','#f0abfc']

export default function SalesByGenre() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSalesByGenre()
      .then(d => setData(d.slice(0, 10)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-gray-100">Försäljning per genre (M)</h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <YAxis dataKey="genre" type="category" tick={{ fill: '#9ca3af', fontSize: 12 }} width={90} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8 }}
            labelStyle={{ color: '#fff' }}
            formatter={v => [`${v.toFixed(1)}M`, 'Försäljning']}
          />
          <Bar dataKey="total_sales" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
