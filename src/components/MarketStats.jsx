import { Activity, TrendingUp, BarChart3, Zap } from 'lucide-react';
import { formatNumber, formatCompact } from '../utils/formatters';
import { calculateVolumeStats, calculateDemandLevel, calculateVolatility, detectTrend } from '../services/analyticsService';

const MarketStats = ({ marketData }) => {
  if (!marketData || !marketData.history) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-white mb-4">Market Statistics</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-white/10 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const { item, history } = marketData;
  const volumeDataPoints = history.volumeDataPoints || [];
  const priceDataPoints = history.priceDataPoints || [];

  // Extract ownership and sales data from scraped Rolimons data
  const ownership = item?.ownership || {};
  const sales = item?.sales || {};

  const volumeStats = calculateVolumeStats(volumeDataPoints);
  const demandLevel = calculateDemandLevel(volumeStats.average);
  const volatility = calculateVolatility(priceDataPoints);
  const trend = detectTrend(priceDataPoints);

  const getDemandColor = (level) => {
    if (level === 'High') return 'text-green-100 bg-green-600/80';
    if (level === 'Medium') return 'text-yellow-100 bg-yellow-600/80';
    return 'text-red-100 bg-red-600/80';
  };

  const getTrendColor = (trend) => {
    if (trend === 'Rising') return 'text-green-400';
    if (trend === 'Falling') return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-6">
      <h2 className="text-lg font-medium text-white mb-6">Market Statistics</h2>

      <div className="space-y-6">
        {/* Volume Statistics */}
        <div className="border-b border-white/10 pb-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 text-blue-400 mr-2" />
            <h3 className="text-sm font-medium text-white">Sales Volume</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 ml-7">
            <div>
              <p className="text-xs text-gray-400">Last 24 Hours</p>
              <p className="text-xl font-semibold text-white">{formatNumber(volumeStats.last24h)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Last 7 Days</p>
              <p className="text-xl font-semibold text-white">{formatNumber(volumeStats.last7d)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Last 30 Days</p>
              <p className="text-xl font-semibold text-white">{formatNumber(volumeStats.last30d)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Volume</p>
              <p className="text-xl font-semibold text-white">{formatCompact(volumeStats.total)}</p>
            </div>
          </div>
        </div>

        {/* Demand Level */}
        <div className="border-b border-white/10 pb-6">
          <div className="flex items-center mb-3">
            <Activity className="w-5 h-5 text-purple-400 mr-2" />
            <h3 className="text-sm font-medium text-white">Market Demand</h3>
          </div>
          <div className="ml-7">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDemandColor(demandLevel)}`}>
                {demandLevel}
              </span>
              <span className="text-sm text-gray-400">
                {sales.avgDailySales !== null && sales.avgDailySales !== undefined
                  ? `${sales.avgDailySales.toFixed(1)} sales/day (Rolimons)`
                  : `${volumeStats.average.toFixed(1)} sales/day avg`}
              </span>
            </div>
          </div>
        </div>

        {/* Price Trend */}
        <div className="border-b border-white/10 pb-6">
          <div className="flex items-center mb-3">
            <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
            <h3 className="text-sm font-medium text-white">Price Trend</h3>
          </div>
          <div className="ml-7">
            <div className="flex items-center space-x-3">
              <span className={`text-lg font-semibold ${getTrendColor(trend)}`}>
                {trend}
              </span>
              <span className="text-sm text-gray-400">
                Based on recent 7-day movement
              </span>
            </div>
          </div>
        </div>

        {/* Volatility */}
        <div>
          <div className="flex items-center mb-3">
            <Zap className="w-5 h-5 text-orange-400 mr-2" />
            <h3 className="text-sm font-medium text-white">Volatility</h3>
          </div>
          <div className="ml-7">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-semibold text-white">
                {volatility.toFixed(2)}%
              </span>
              <span className="text-sm text-gray-400">
                Price variation (std dev)
              </span>
            </div>
            <div className="mt-2 w-full bg-white/20 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${volatility > 20 ? 'bg-red-500' : volatility > 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(100, volatility * 2)}%` }}
              ></div>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              {volatility > 20 ? 'High' : volatility > 10 ? 'Moderate' : 'Low'} volatility
            </p>
          </div>
        </div>

        {/* Ownership Information */}
        {(ownership.totalCopies !== null || history.assetStock !== undefined) && (
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-sm font-medium text-white mb-4">Ownership Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              {ownership.totalCopies !== null && (
                <div>
                  <p className="text-xs text-gray-400">Total Copies</p>
                  <p className="text-xl font-semibold text-white">
                    {formatNumber(ownership.totalCopies)}
                  </p>
                </div>
              )}
              {ownership.availableCopies !== null && (
                <div>
                  <p className="text-xs text-gray-400">Available Copies</p>
                  <p className="text-xl font-semibold text-white">
                    {formatNumber(ownership.availableCopies)}
                  </p>
                </div>
              )}
              {ownership.owners !== null && (
                <div>
                  <p className="text-xs text-gray-400">Total Owners</p>
                  <p className="text-xl font-semibold text-white">
                    {formatNumber(ownership.owners)}
                  </p>
                </div>
              )}
              {ownership.premiumOwners !== null && (
                <div>
                  <p className="text-xs text-gray-400">Premium Owners</p>
                  <p className="text-xl font-semibold text-white">
                    {formatNumber(ownership.premiumOwners)}
                  </p>
                </div>
              )}
              {ownership.hoardedCopies !== null && (
                <div>
                  <p className="text-xs text-gray-400">Hoarded Copies</p>
                  <p className="text-xl font-semibold text-white">
                    {formatNumber(ownership.hoardedCopies)}
                    {ownership.percentHoarded !== null && (
                      <span className="text-sm text-gray-400 ml-1">
                        ({ownership.percentHoarded.toFixed(1)}%)
                      </span>
                    )}
                  </p>
                </div>
              )}
              {ownership.deletedCopies !== null && (
                <div>
                  <p className="text-xs text-gray-400">Deleted Copies</p>
                  <p className="text-xl font-semibold text-white">
                    {formatNumber(ownership.deletedCopies)}
                  </p>
                </div>
              )}
              {history.originalPrice && (
                <div>
                  <p className="text-xs text-gray-400">Original Price</p>
                  <p className="text-xl font-semibold text-white">
                    {formatNumber(history.originalPrice)} R$
                  </p>
                </div>
              )}
              {sales.rapAfterSale !== null && (
                <div>
                  <p className="text-xs text-gray-400">RAP After Sale</p>
                  <p className="text-xl font-semibold text-white">
                    {formatNumber(sales.rapAfterSale)} R$
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketStats;
