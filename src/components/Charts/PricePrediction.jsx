import { TrendingUp, AlertCircle, Target } from 'lucide-react';
import { formatRobux, formatPercent } from '../../utils/formatters';
import { predictPrice, calculatePriceIncreaseProbability, generatePriceProjection } from '../../utils/pricePredictor';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';

const PricePrediction = ({ priceDataPoints }) => {
  if (!priceDataPoints || priceDataPoints.length < 7) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-white mb-4">Price Prediction</h2>
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-500" />
            <p>Not enough data for price prediction</p>
            <p className="text-sm mt-1">Need at least 7 days of price history</p>
          </div>
        </div>
      </div>
    );
  }

  // Get predictions for different time frames
  const prediction24h = predictPrice(priceDataPoints, 1);
  const prediction7d = predictPrice(priceDataPoints, 7);
  const prediction30d = predictPrice(priceDataPoints, 30);

  const increaseProb = calculatePriceIncreaseProbability(priceDataPoints);

  // Generate projection for chart
  const projection = generatePriceProjection(priceDataPoints, 7);
  const currentPrice = priceDataPoints[priceDataPoints.length - 1].value;

  // Combine historical and projected data for chart
  const chartData = [
    ...priceDataPoints.slice(-14).map((p) => ({
      date: new Date(p.date),
      actual: p.value,
      projected: null,
    })),
    ...projection.map((p) => ({
      date: new Date(p.date),
      actual: null,
      projected: p.value,
    })),
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-lg p-3 border border-white/20 rounded shadow-lg">
          <p className="text-sm text-gray-300 mb-1">
            {format(data.date, 'MMM dd, yyyy')}
          </p>
          {data.actual && (
            <p className="text-sm font-semibold text-blue-400">
              Actual: {formatRobux(data.actual)}
            </p>
          )}
          {data.projected && (
            <p className="text-sm font-semibold text-green-400">
              Projected: {formatRobux(data.projected)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 70) return 'text-green-100 bg-green-600/80';
    if (confidence >= 40) return 'text-yellow-100 bg-yellow-600/80';
    return 'text-red-100 bg-red-600/80';
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Target className="w-6 h-6 text-blue-400 mr-2" />
        <h2 className="text-lg font-medium text-white">Price Prediction</h2>
      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 24h Prediction */}
        <div className="border border-white/20 bg-white/5 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">24 Hour Prediction</p>
          <p className="text-2xl font-bold text-white">
            {prediction24h.predicted ? formatRobux(prediction24h.predicted) : 'N/A'}
          </p>
          {prediction24h.predicted && (
            <div className="mt-2">
              <p className="text-xs text-gray-400">
                Range: {formatRobux(prediction24h.lower)} - {formatRobux(prediction24h.upper)}
              </p>
              <div className="flex items-center mt-1">
                <span className={`text-xs px-2 py-0.5 rounded ${getConfidenceColor(prediction24h.confidence)}`}>
                  {prediction24h.confidence}% confidence
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 7d Prediction */}
        <div className="border border-white/20 bg-white/5 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">7 Day Prediction</p>
          <p className="text-2xl font-bold text-white">
            {prediction7d.predicted ? formatRobux(prediction7d.predicted) : 'N/A'}
          </p>
          {prediction7d.predicted && (
            <div className="mt-2">
              <p className="text-xs text-gray-400">
                Range: {formatRobux(prediction7d.lower)} - {formatRobux(prediction7d.upper)}
              </p>
              <div className="flex items-center mt-1">
                <span className={`text-xs px-2 py-0.5 rounded ${getConfidenceColor(prediction7d.confidence)}`}>
                  {prediction7d.confidence}% confidence
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 30d Prediction */}
        <div className="border border-white/20 bg-white/5 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">30 Day Prediction</p>
          <p className="text-2xl font-bold text-white">
            {prediction30d.predicted ? formatRobux(prediction30d.predicted) : 'N/A'}
          </p>
          {prediction30d.predicted && (
            <div className="mt-2">
              <p className="text-xs text-gray-400">
                Range: {formatRobux(prediction30d.lower)} - {formatRobux(prediction30d.upper)}
              </p>
              <div className="flex items-center mt-1">
                <span className={`text-xs px-2 py-0.5 rounded ${getConfidenceColor(prediction30d.confidence)}`}>
                  {prediction30d.confidence}% confidence
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Price Increase Probability */}
      <div className="mb-6 p-4 bg-white/5 border border-white/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
            <span className="text-sm font-medium text-gray-300">Probability of Price Increase</span>
          </div>
          <span className={`text-2xl font-bold ${increaseProb >= 50 ? 'text-green-400' : 'text-red-400'}`}>
            {increaseProb}%
          </span>
        </div>
        <div className="mt-2 w-full bg-white/20 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${increaseProb >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${increaseProb}%` }}
          ></div>
        </div>
      </div>

      {/* Projection Chart */}
      <div style={{ width: '100%', height: 256 }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(date, 'MMM dd')}
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              x={new Date()}
              stroke="#ef4444"
              strokeDasharray="3 3"
              label="Today"
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Actual"
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Projected"
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center">
        Predictions are based on historical data and should not be considered financial advice
      </div>
    </div>
  );
};

export default PricePrediction;
