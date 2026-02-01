import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { formatRobux } from '../../utils/formatters';
import { calculateMovingAverage } from '../../services/analyticsService';
import { filterByDateRange, getDateRange } from '../../utils/dateHelpers';

const TIME_RANGES = [
  { label: '24H', value: '24h' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: '1Y', value: '1y' },
  { label: 'All', value: 'all' },
];

const PriceHistoryChart = ({ priceDataPoints }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [showMA7, setShowMA7] = useState(true);
  const [showMA30, setShowMA30] = useState(false);

  if (!priceDataPoints || priceDataPoints.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Price History</h2>
        <div className="h-96 flex items-center justify-center text-gray-500">
          No price data available
        </div>
      </div>
    );
  }

  // Filter data by time range
  const { start, end } = getDateRange(timeRange);
  const filteredData = filterByDateRange(priceDataPoints, start, end);

  // Calculate moving averages
  const ma7Data = calculateMovingAverage(filteredData, 7);
  const ma30Data = calculateMovingAverage(filteredData, 30);

  // Prepare chart data
  const chartData = filteredData.map((point) => ({
    date: point.date,
    price: point.value,
    timestamp: new Date(point.date).getTime(),
  }));

  // Add MA data
  if (showMA7) {
    ma7Data.forEach((ma) => {
      const existing = chartData.find((d) => d.date === ma.date);
      if (existing) existing.ma7 = ma.value;
    });
  }

  if (showMA30) {
    ma30Data.forEach((ma) => {
      const existing = chartData.find((d) => d.date === ma.date);
      if (existing) existing.ma30 = ma.value;
    });
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="text-sm text-gray-600 mb-1">
            {format(parseISO(payload[0].payload.date), 'MMM dd, yyyy HH:mm')}
          </p>
          <p className="text-sm font-semibold text-blue-600">
            Price: {formatRobux(payload[0].value)}
          </p>
          {showMA7 && payload[1] && (
            <p className="text-sm text-green-600">
              MA(7): {formatRobux(payload[1].value)}
            </p>
          )}
          {showMA30 && payload[2] && (
            <p className="text-sm text-purple-600">
              MA(30): {formatRobux(payload[2].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Price History</h2>

        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          {/* Moving Averages Toggles */}
          <div className="flex items-center space-x-3 text-sm">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showMA7}
                onChange={(e) => setShowMA7(e.target.checked)}
                className="rounded text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-gray-700">MA(7)</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showMA30}
                onChange={(e) => setShowMA30(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700">MA(30)</span>
            </label>
          </div>

          {/* Time Range Selector */}
          <div className="inline-flex rounded-md shadow-sm">
            {TIME_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-1 text-sm font-medium border ${
                  timeRange === range.value
                    ? 'bg-blue-600 text-white border-blue-600 z-10'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                } ${range.value === '24h' ? 'rounded-l-md' : ''} ${
                  range.value === 'all' ? 'rounded-r-md' : ''
                } -ml-px first:ml-0`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(tick) => format(new Date(tick), 'MMM dd')}
              stroke="#9ca3af"
            />
            <YAxis
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              stroke="#9ca3af"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Price"
              isAnimationActive={false}
            />
            {showMA7 && (
              <Line
                type="monotone"
                dataKey="ma7"
                stroke="#10b981"
                strokeWidth={1.5}
                dot={false}
                name="MA(7)"
                strokeDasharray="5 5"
                isAnimationActive={false}
              />
            )}
            {showMA30 && (
              <Line
                type="monotone"
                dataKey="ma30"
                stroke="#8b5cf6"
                strokeWidth={1.5}
                dot={false}
                name="MA(30)"
                strokeDasharray="5 5"
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {filteredData.length === 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          No data available for the selected time range
        </div>
      )}
    </div>
  );
};

export default PriceHistoryChart;
