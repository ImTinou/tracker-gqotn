import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useItemData } from '../hooks/useItemData';
import { POPULAR_ITEMS } from '../constants/itemConfig';
import ItemHeader from '../components/ItemHeader';
import PriceOverview from '../components/PriceOverview';
import MarketStats from '../components/MarketStats';
import PriceHistoryChart from '../components/Charts/PriceHistoryChart';
import PricePrediction from '../components/Charts/PricePrediction';
import RecentSales from '../components/RecentSales';

const ItemPage = () => {
  const { itemId } = useParams();
  const { data, loading, error, lastUpdated, refresh } = useItemData(itemId, true);

  // Find item info from POPULAR_ITEMS
  const itemInfo = POPULAR_ITEMS.find((item) => item.id === itemId);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading market data...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-lg p-8">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
            <h2 className="text-xl font-semibold text-white">Error Loading Data</h2>
          </div>
          <p className="text-gray-300 mb-4">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={refresh}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Try Again
            </button>
            <Link
              to="/"
              className="flex-1 px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 text-center"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

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
          <div className="mb-6 bg-yellow-500/10 border-l-4 border-yellow-400 p-4 rounded backdrop-blur-lg">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
              <p className="text-sm text-yellow-300">
                Failed to refresh data. Showing cached version. {error}
              </p>
            </div>
          </div>
        )}

        {/* Mock Data Warning */}
        {data?.history?._isMockData && (
          <div className="mb-6 bg-blue-500/10 border-l-4 border-blue-400 p-4 rounded backdrop-blur-lg">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-blue-400 mr-2" />
              <div className="text-sm text-blue-300">
                <p className="font-medium">Using Mock Data</p>
                <p className="mt-1">
                  Real Roblox API data is unavailable. Displaying simulated price history based on Rolimons data.
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
            <div className="lg:col-span-2 min-h-0">
              <PriceHistoryChart priceDataPoints={data?.history?.priceDataPoints} />
            </div>

            {/* Market Stats - Takes 1 column */}
            <div className="min-h-0">
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
      <footer className="mt-12 border-t border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-400">
            <p>{itemInfo?.name || data?.item?.name || 'Item'} Market Tracker</p>
            <p className="mt-1">
              Data refreshes automatically every minute. Not affiliated with Roblox Corporation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ItemPage;
