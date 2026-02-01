import { subDays, subHours, isAfter } from 'date-fns';

/**
 * Calculate price statistics
 * @param {Array} priceDataPoints - Array of price data points
 * @returns {Object} Price statistics
 */
export const calculatePriceStats = (priceDataPoints) => {
  if (!priceDataPoints || priceDataPoints.length === 0) {
    return {
      min: 0,
      max: 0,
      average: 0,
      median: 0,
      current: 0,
    };
  }

  const prices = priceDataPoints.map((p) => p.value);
  const sortedPrices = [...prices].sort((a, b) => a - b);

  return {
    min: sortedPrices[0],
    max: sortedPrices[sortedPrices.length - 1],
    average: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    median: sortedPrices[Math.floor(sortedPrices.length / 2)],
    current: prices[prices.length - 1],
  };
};

/**
 * Calculate price change over period
 * @param {Array} priceDataPoints - Array of price data points
 * @param {number} hours - Hours to look back
 * @returns {Object} Price change data
 */
export const calculatePriceChange = (priceDataPoints, hours) => {
  if (!priceDataPoints || priceDataPoints.length < 2) {
    return { change: 0, changePercent: 0 };
  }

  const cutoffDate = subHours(new Date(), hours);
  const currentPrice = priceDataPoints[priceDataPoints.length - 1].value;

  // Find price at cutoff time
  const historicalPoint = priceDataPoints.find((p) => {
    const pointDate = new Date(p.date);
    return isAfter(pointDate, cutoffDate);
  });

  const historicalPrice = historicalPoint ? historicalPoint.value : priceDataPoints[0].value;

  const change = currentPrice - historicalPrice;
  const changePercent = historicalPrice !== 0 ? ((change / historicalPrice) * 100) : 0;

  return {
    change,
    changePercent: parseFloat(changePercent.toFixed(2)),
  };
};

/**
 * Calculate volume statistics
 * @param {Array} volumeDataPoints - Array of volume data points
 * @returns {Object} Volume statistics
 */
export const calculateVolumeStats = (volumeDataPoints) => {
  if (!volumeDataPoints || volumeDataPoints.length === 0) {
    return {
      total: 0,
      average: 0,
      last24h: 0,
      last7d: 0,
      last30d: 0,
    };
  }

  const now = new Date();
  const day24Ago = subDays(now, 1);
  const days7Ago = subDays(now, 7);
  const days30Ago = subDays(now, 30);

  const total = volumeDataPoints.reduce((sum, p) => sum + p.value, 0);
  const average = total / volumeDataPoints.length;

  const last24h = volumeDataPoints
    .filter((p) => isAfter(new Date(p.date), day24Ago))
    .reduce((sum, p) => sum + p.value, 0);

  const last7d = volumeDataPoints
    .filter((p) => isAfter(new Date(p.date), days7Ago))
    .reduce((sum, p) => sum + p.value, 0);

  const last30d = volumeDataPoints
    .filter((p) => isAfter(new Date(p.date), days30Ago))
    .reduce((sum, p) => sum + p.value, 0);

  return {
    total,
    average: Math.round(average * 10) / 10,
    last24h,
    last7d,
    last30d,
  };
};

/**
 * Calculate demand level based on volume
 * @param {number} averageDailyVolume - Average daily volume
 * @returns {string} Demand level (High, Medium, Low)
 */
export const calculateDemandLevel = (averageDailyVolume) => {
  if (averageDailyVolume >= 10) return 'High';
  if (averageDailyVolume >= 5) return 'Medium';
  return 'Low';
};

/**
 * Calculate price volatility (standard deviation)
 * @param {Array} priceDataPoints - Array of price data points
 * @returns {number} Volatility value
 */
export const calculateVolatility = (priceDataPoints) => {
  if (!priceDataPoints || priceDataPoints.length < 2) {
    return 0;
  }

  const prices = priceDataPoints.map((p) => p.value);
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;

  const squaredDiffs = prices.map((price) => Math.pow(price - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / prices.length;
  const stdDev = Math.sqrt(variance);

  // Return as percentage of mean
  return parseFloat(((stdDev / mean) * 100).toFixed(2));
};

/**
 * Calculate RSI (Relative Strength Index)
 * @param {Array} priceDataPoints - Array of price data points
 * @param {number} period - RSI period (default 14)
 * @returns {number} RSI value (0-100)
 */
export const calculateRSI = (priceDataPoints, period = 14) => {
  if (!priceDataPoints || priceDataPoints.length < period + 1) {
    return 50; // Neutral RSI
  }

  const prices = priceDataPoints.map((p) => p.value);
  const changes = [];

  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1]);
  }

  const recentChanges = changes.slice(-period);
  const gains = recentChanges.filter((c) => c > 0).reduce((a, b) => a + b, 0) / period;
  const losses = Math.abs(recentChanges.filter((c) => c < 0).reduce((a, b) => a + b, 0)) / period;

  if (losses === 0) return 100;

  const rs = gains / losses;
  const rsi = 100 - (100 / (1 + rs));

  return parseFloat(rsi.toFixed(2));
};

/**
 * Calculate moving average
 * @param {Array} priceDataPoints - Array of price data points
 * @param {number} period - Period for moving average
 * @returns {Array} Moving average data points
 */
export const calculateMovingAverage = (priceDataPoints, period) => {
  if (!priceDataPoints || priceDataPoints.length < period) {
    return [];
  }

  const movingAvg = [];

  for (let i = period - 1; i < priceDataPoints.length; i++) {
    const slice = priceDataPoints.slice(i - period + 1, i + 1);
    const avg = slice.reduce((sum, p) => sum + p.value, 0) / period;

    movingAvg.push({
      date: priceDataPoints[i].date,
      value: Math.round(avg),
    });
  }

  return movingAvg;
};

/**
 * Detect trend direction
 * @param {Array} priceDataPoints - Array of price data points
 * @returns {string} Trend direction (Rising, Falling, Stable)
 */
export const detectTrend = (priceDataPoints) => {
  if (!priceDataPoints || priceDataPoints.length < 2) {
    return 'Stable';
  }

  // Use last 7 data points
  const recentData = priceDataPoints.slice(-7);
  const firstPrice = recentData[0].value;
  const lastPrice = recentData[recentData.length - 1].value;

  const change = ((lastPrice - firstPrice) / firstPrice) * 100;

  if (change > 5) return 'Rising';
  if (change < -5) return 'Falling';
  return 'Stable';
};
