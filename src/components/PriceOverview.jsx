import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatRobux, formatPercent, getTrendColor, getTrendBgColor } from '../utils/formatters';
import { calculatePriceChange, calculatePriceStats } from '../services/analyticsService';

const StatCard = ({ title, value, change, changePercent, description }) => {
  const getTrendIcon = (val) => {
    if (val > 0) return <TrendingUp className="w-4 h-4" />;
    if (val < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
            {description && (
              <p className="mt-1 text-xs text-gray-500">{description}</p>
            )}
          </div>
        </div>
        {change !== undefined && change !== null && (
          <div className="mt-4">
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getTrendBgColor(change)}`}>
              {getTrendIcon(change)}
              <span className="ml-1">
                {change > 0 ? '+' : ''}{formatRobux(Math.abs(change)).replace(' R$', '')}
              </span>
              {changePercent !== undefined && (
                <span className="ml-1">({formatPercent(changePercent)})</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PriceOverview = ({ marketData }) => {
  if (!marketData || !marketData.history) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
            <div className="p-5">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const { item, history } = marketData;
  const priceDataPoints = history.priceDataPoints || [];
  const stats = calculatePriceStats(priceDataPoints);

  // Calculate price changes
  const change24h = calculatePriceChange(priceDataPoints, 24);
  const change7d = calculatePriceChange(priceDataPoints, 24 * 7);
  const change30d = calculatePriceChange(priceDataPoints, 24 * 30);

  const rap = item?.rap || history.recentAveragePrice || stats.average;
  const currentPrice = stats.current || rap;

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Price Overview</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="RAP (Recent Average Price)"
          value={formatRobux(rap)}
          description="Recent average trading price"
        />

        <StatCard
          title="Current Price"
          value={formatRobux(currentPrice)}
          change={change24h.change}
          changePercent={change24h.changePercent}
        />

        <StatCard
          title="7-Day Change"
          value={formatPercent(change7d.changePercent)}
          change={change7d.change}
          changePercent={change7d.changePercent}
        />

        <StatCard
          title="30-Day Change"
          value={formatPercent(change30d.changePercent)}
          change={change30d.change}
          changePercent={change30d.changePercent}
        />
      </div>

      {/* Additional Stats */}
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          title="Lowest Price"
          value={formatRobux(stats.min)}
          description="All-time lowest"
        />

        <StatCard
          title="Highest Price"
          value={formatRobux(stats.max)}
          description="All-time highest"
        />

        <StatCard
          title="Average Price"
          value={formatRobux(stats.average)}
          description="Historical average"
        />
      </div>
    </div>
  );
};

export default PriceOverview;
