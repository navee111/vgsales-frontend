import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getSalesByPlatform } from '../../api/client'
import LoadingSpinner from '../LoadingSpinner'

const COLORS = ['#a855f7','#8b5cf6','#6d28d9','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444']

export default function SalesByPlatform() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSalesByPlatform()
      .then(d => setData(d.slice(0, 8)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <h2 className="text-lg font-semibold mb-4 text-gray-100">Top 8 plattformar</h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="total_sales" nameKey="platform" cx="50%" cy="50%" outerRadius={100} label={({ platform }) => platform}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8 }}
            formatter={v => [`${v.toFixed(1)}M`, 'Försäljning']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
