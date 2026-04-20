import SalesBygeGenre from '../components/charts/SalesByGenre'
import SalesOvertime from '../components/charts/SalesOverTime'
import SalesByPlatform from '../components/charts/SalesByPlatform'
import TopPublishers from '../components/charts/TopPublishers'

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font bold mb-2"> Video Games Sales Dashboard</h1>
      <p className="text-gray-400 mb-8">16598 spel 1980-2010 NA,EU, JP och global </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesOverTime />
        <SalesByGenre />
        <SalesByPlatform />
        <TopPublishers />
      </div>
    </div>
  )
}
