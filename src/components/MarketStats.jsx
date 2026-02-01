import { Activity, TrendingUp, BarChart3, Zap } from 'lucide-react';
import { formatNumber, formatCompact } from '../utils/formatters';
import { calculateVolumeStats, calculateDemandLevel, calculateVolatility, detectTrend } from '../services/analyticsService';

const MarketStats = ({ marketData }) => {
  if (!marketData || !marketData.history) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Market Statistics</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const { history } = marketData;
  const volumeDataPoints = history.volumeDataPoints || [];
  const priceDataPoints = history.priceDataPoints || [];

  const volumeStats = calculateVolumeStats(volumeDataPoints);
  const demandLevel = calculateDemandLevel(volumeStats.average);
  const volatility = calculateVolatility(priceDataPoints);
  const trend = detectTrend(priceDataPoints);

  const getDemandColor = (level) => {
    if (level === 'High') return 'text-green-600 bg-green-50';
    if (level === 'Medium') return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendColor = (trend) => {
    if (trend === 'Rising') return 'text-green-600';
    if (trend === 'Falling') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Market Statistics</h2>

      <div className="space-y-6">
        {/* Volume Statistics */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-900">Sales Volume</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 ml-7">
            <div>
              <p className="text-xs text-gray-500">Last 24 Hours</p>
              <p className="text-xl font-semibold text-gray-900">{formatNumber(volumeStats.last24h)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Last 7 Days</p>
              <p className="text-xl font-semibold text-gray-900">{formatNumber(volumeStats.last7d)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Last 30 Days</p>
              <p className="text-xl font-semibold text-gray-900">{formatNumber(volumeStats.last30d)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Volume</p>
              <p className="text-xl font-semibold text-gray-900">{formatCompact(volumeStats.total)}</p>
            </div>
          </div>
        </div>

        {/* Demand Level */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center mb-3">
            <Activity className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-900">Market Demand</h3>
          </div>
          <div className="ml-7">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDemandColor(demandLevel)}`}>
                {demandLevel}
              </span>
              <span className="text-sm text-gray-500">
                {volumeStats.average.toFixed(1)} sales/day avg
              </span>
            </div>
          </div>
        </div>

        {/* Price Trend */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center mb-3">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-900">Price Trend</h3>
          </div>
          <div className="ml-7">
            <div className="flex items-center space-x-3">
              <span className={`text-lg font-semibold ${getTrendColor(trend)}`}>
                {trend}
              </span>
              <span className="text-sm text-gray-500">
                Based on recent 7-day movement
              </span>
            </div>
          </div>
        </div>

        {/* Volatility */}
        <div>
          <div className="flex items-center mb-3">
            <Zap className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="text-sm font-medium text-gray-900">Volatility</h3>
          </div>
          <div className="ml-7">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-semibold text-gray-900">
                {volatility.toFixed(2)}%
              </span>
              <span className="text-sm text-gray-500">
                Price variation (std dev)
              </span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${volatility > 20 ? 'bg-red-500' : volatility > 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(100, volatility * 2)}%` }}
              ></div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {volatility > 20 ? 'High' : volatility > 10 ? 'Moderate' : 'Low'} volatility
            </p>
          </div>
        </div>

        {/* Stock Information */}
        {history.assetStock !== undefined && (
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Items Remaining</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatNumber(history.numberRemaining || history.assetStock)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Original Price</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatNumber(history.originalPrice)} R$
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketStats;
