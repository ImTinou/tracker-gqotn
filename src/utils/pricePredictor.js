/**
 * Price Prediction Algorithms
 */

/**
 * Linear regression for price prediction
 * @param {Array} priceDataPoints - Historical price data
 * @returns {Object} Regression coefficients
 */
const linearRegression = (priceDataPoints) => {
  const n = priceDataPoints.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  priceDataPoints.forEach((point, index) => {
    const x = index;
    const y = point.value;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};

/**
 * Predict future price using linear regression
 * @param {Array} priceDataPoints - Historical price data
 * @param {number} daysAhead - Number of days to predict ahead
 * @returns {number} Predicted price
 */
export const predictPriceLinear = (priceDataPoints, daysAhead = 1) => {
  if (!priceDataPoints || priceDataPoints.length < 3) {
    return null;
  }

  const { slope, intercept } = linearRegression(priceDataPoints);
  const futureIndex = priceDataPoints.length + daysAhead - 1;
  const predictedPrice = slope * futureIndex + intercept;

  return Math.round(Math.max(0, predictedPrice));
};

/**
 * Calculate Exponential Moving Average (EMA)
 * @param {Array} priceDataPoints - Historical price data
 * @param {number} period - EMA period (default 10)
 * @returns {number} EMA value
 */
export const calculateEMA = (priceDataPoints, period = 10) => {
  if (!priceDataPoints || priceDataPoints.length < period) {
    return null;
  }

  const k = 2 / (period + 1);
  let ema = priceDataPoints.slice(0, period).reduce((sum, p) => sum + p.value, 0) / period;

  for (let i = period; i < priceDataPoints.length; i++) {
    ema = priceDataPoints[i].value * k + ema * (1 - k);
  }

  return Math.round(ema);
};

/**
 * Predict price using moving average
 * @param {Array} priceDataPoints - Historical price data
 * @param {number} period - Moving average period
 * @returns {number} Predicted price
 */
export const predictPriceMA = (priceDataPoints, period = 7) => {
  if (!priceDataPoints || priceDataPoints.length < period) {
    return null;
  }

  const recent = priceDataPoints.slice(-period);
  const average = recent.reduce((sum, p) => sum + p.value, 0) / period;

  return Math.round(average);
};

/**
 * Comprehensive price prediction with confidence interval
 * @param {Array} priceDataPoints - Historical price data
 * @param {number} daysAhead - Days to predict ahead (1, 7, 30)
 * @returns {Object} Prediction with confidence interval
 */
export const predictPrice = (priceDataPoints, daysAhead = 1) => {
  if (!priceDataPoints || priceDataPoints.length < 7) {
    return {
      predicted: null,
      confidence: 0,
      lower: null,
      upper: null,
      method: 'insufficient_data',
    };
  }

  // Get predictions from multiple methods
  const linearPrediction = predictPriceLinear(priceDataPoints, daysAhead);
  const emaPrediction = calculateEMA(priceDataPoints, 10);
  const maPrediction = predictPriceMA(priceDataPoints, 7);

  // Weight the predictions (linear 40%, EMA 40%, MA 20%)
  const predictions = [
    { value: linearPrediction, weight: 0.4 },
    { value: emaPrediction, weight: 0.4 },
    { value: maPrediction, weight: 0.2 },
  ].filter((p) => p.value !== null);

  if (predictions.length === 0) {
    return {
      predicted: null,
      confidence: 0,
      lower: null,
      upper: null,
      method: 'no_predictions',
    };
  }

  const weightedSum = predictions.reduce((sum, p) => sum + p.value * p.weight, 0);
  const totalWeight = predictions.reduce((sum, p) => sum + p.weight, 0);
  const predicted = Math.round(weightedSum / totalWeight);

  // Calculate volatility for confidence interval
  const prices = priceDataPoints.map((p) => p.value);
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
  const stdDev = Math.sqrt(variance);

  // Confidence interval: ±1 standard deviation
  const lower = Math.round(Math.max(0, predicted - stdDev));
  const upper = Math.round(predicted + stdDev);

  // Confidence score (0-100) - higher for more data and lower volatility
  const dataConfidence = Math.min(100, (priceDataPoints.length / 30) * 100);
  const volatilityConfidence = Math.max(0, 100 - (stdDev / mean) * 100);
  const confidence = Math.round((dataConfidence + volatilityConfidence) / 2);

  return {
    predicted,
    confidence,
    lower,
    upper,
    method: 'weighted_ensemble',
    components: {
      linear: linearPrediction,
      ema: emaPrediction,
      ma: maPrediction,
    },
  };
};

/**
 * Calculate probability of price increase
 * @param {Array} priceDataPoints - Historical price data
 * @returns {number} Probability (0-100)
 */
export const calculatePriceIncreaseProbability = (priceDataPoints) => {
  if (!priceDataPoints || priceDataPoints.length < 2) {
    return 50; // Neutral probability
  }

  const recentData = priceDataPoints.slice(-10);
  let increases = 0;

  for (let i = 1; i < recentData.length; i++) {
    if (recentData[i].value > recentData[i - 1].value) {
      increases++;
    }
  }

  return Math.round((increases / (recentData.length - 1)) * 100);
};

/**
 * Generate price projection for future dates
 * @param {Array} priceDataPoints - Historical price data
 * @param {number} days - Number of days to project
 * @returns {Array} Projected price data points
 */
export const generatePriceProjection = (priceDataPoints, days = 7) => {
  if (!priceDataPoints || priceDataPoints.length < 3) {
    return [];
  }

  const projection = [];
  const { slope, intercept } = linearRegression(priceDataPoints);

  for (let i = 1; i <= days; i++) {
    const futureIndex = priceDataPoints.length + i - 1;
    const predictedValue = Math.round(Math.max(0, slope * futureIndex + intercept));

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + i);

    projection.push({
      date: futureDate.toISOString(),
      value: predictedValue,
      isProjected: true,
    });
  }

  return projection;
};
