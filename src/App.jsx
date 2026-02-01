import { AlertCircle, Loader2 } from 'lucide-react';
import { useItemData } from './hooks/useItemData';
import ItemHeader from './components/ItemHeader';
import PriceOverview from './components/PriceOverview';
import MarketStats from './components/MarketStats';
import PriceHistoryChart from './components/Charts/PriceHistoryChart';
import PricePrediction from './components/Charts/PricePrediction';
import RecentSales from './components/RecentSales';

function App() {
  const { data, loading, error, lastUpdated, refresh } = useItemData(true);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading market data...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Error Loading Data</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ItemHeader
        itemData={data?.item}
        lastUpdated={lastUpdated}
        onRefresh={refresh}
        isRefreshing={loading}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner (if error while data exists) */}
        {error && data && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-700">
                Failed to refresh data. Showing cached version. {error}
              </p>
            </div>
          </div>
        )}

        {/* Mock Data Warning */}
        {data?.history?._isMockData && (
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-blue-400 mr-2" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">Using Mock Data</p>
                <p className="mt-1">
                  Real Roblox API data is unavailable. Displaying simulated price history based on Rolimons data.
                  Update the Asset ID in [src/constants/itemConfig.js](src/constants/itemConfig.js) with the correct ID for Green Queen of the Night.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Price Overview */}
          <section>
            <PriceOverview marketData={data} />
          </section>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Price History Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <PriceHistoryChart priceDataPoints={data?.history?.priceDataPoints} />
            </div>

            {/* Market Stats - Takes 1 column */}
            <div>
              <MarketStats marketData={data} />
            </div>
          </div>

          {/* Price Prediction */}
          <section>
            <PricePrediction priceDataPoints={data?.history?.priceDataPoints} />
          </section>

          {/* Recent Sales */}
          <section>
            <RecentSales priceDataPoints={data?.history?.priceDataPoints} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Green Queen of the Night Market Tracker</p>
            <p className="mt-1">
              Data refreshes automatically every minute. Not affiliated with Roblox Corporation.
            </p>
            <p className="mt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                View on GitHub
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
