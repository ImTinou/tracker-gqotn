import axios from 'axios';
import { ITEM_CONFIG } from '../constants/itemConfig';
import { getCache, setCache } from './cacheService';

/**
 * Fetch item data from Rolimons API
 * @returns {Promise<Object>} Item data
 */
export const fetchItemData = async () => {
  // Check cache first
  const cached = getCache('itemData');
  if (cached) {
    console.log('Using cached item data');
    return cached;
  }

  try {
    // Use Vercel serverless function to avoid CORS issues
    const response = await axios.get(`${ITEM_CONFIG.apiBaseUrl}/api/rolimons`);

    const allItems = response.data.items;
    const itemData = allItems[ITEM_CONFIG.assetId];

    if (!itemData) {
      throw new Error('Item not found in Rolimons data');
    }

    // Add assetId to the data
    const enrichedData = {
      ...itemData,
      assetId: ITEM_CONFIG.assetId,
      lastUpdated: new Date().toISOString(),
    };

    // Cache the data
    setCache('itemData', enrichedData, ITEM_CONFIG.cache.itemData);

    return enrichedData;
  } catch (error) {
    console.error('Error fetching item data:', error);
    throw error;
  }
};

/**
 * Fetch price history from Roblox Resale API
 * Note: This may require a proxy due to CORS restrictions
 * @returns {Promise<Object>} Resale data with price history
 */
export const fetchPriceHistory = async () => {
  // Check cache first
  const cached = getCache('priceHistory');
  if (cached) {
    console.log('Using cached price history');
    return cached;
  }

  try {
    // Try to fetch from Roblox Economy API with CORS proxy
    // Use Vercel serverless function to avoid CORS issues
    const response = await axios.get(
      `${ITEM_CONFIG.apiBaseUrl}/api/roblox?assetId=${ITEM_CONFIG.assetId}`
    );

    const data = response.data;

    // Cache the data
    setCache('priceHistory', data, ITEM_CONFIG.cache.priceHistory);

    return data;
  } catch (error) {
    console.error('Error fetching price history:', error);

    // Fallback: Generate mock data from Rolimons data
    console.warn('Using fallback mock data for price history');
    return generateMockPriceHistory();
  }
};

/**
 * Generate mock price history data (fallback when API unavailable)
 * @returns {Object} Mock price history data
 */
const generateMockPriceHistory = async () => {
  try {
    const itemData = await fetchItemData();

    // Generate mock data points around the RAP value
    const now = new Date();
    const dataPoints = [];

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Generate price variation around RAP (±10%)
      const variation = (Math.random() - 0.5) * 0.2;
      const price = Math.round(itemData.rap * (1 + variation));

      dataPoints.push({
        value: price,
        date: date.toISOString(),
      });
    }

    const mockData = {
      assetStock: 150,
      sales: 45,
      numberRemaining: 150,
      recentAveragePrice: itemData.rap,
      originalPrice: itemData.default_value || 10000,
      priceDataPoints: dataPoints,
      volumeDataPoints: generateMockVolumeData(),
      _isMockData: true,
    };

    return mockData;
  } catch (error) {
    throw new Error('Could not generate mock data');
  }
};

/**
 * Generate mock volume data
 * @returns {Array} Mock volume data points
 */
const generateMockVolumeData = () => {
  const now = new Date();
  const volumePoints = [];

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    volumePoints.push({
      value: Math.floor(Math.random() * 10) + 1, // 1-10 sales per day
      date: date.toISOString().split('T')[0],
    });
  }

  return volumePoints;
};

/**
 * Fetch complete market data (item data + price history)
 * @returns {Promise<Object>} Complete market data
 */
export const fetchCompleteMarketData = async () => {
  try {
    const [itemData, priceHistory] = await Promise.all([
      fetchItemData(),
      fetchPriceHistory(),
    ]);

    return {
      item: itemData,
      history: priceHistory,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching complete market data:', error);
    throw error;
  }
};

/**
 * Get item thumbnail URL
 * @param {string} assetId - Asset ID
 * @param {string} size - Thumbnail size (default: '420x420')
 * @returns {string} Thumbnail URL
 */
export const getItemThumbnail = (assetId = ITEM_CONFIG.assetId, size = '420x420') => {
  return `https://www.roblox.com/asset-thumbnail/image?assetId=${assetId}&width=${size.split('x')[0]}&height=${size.split('x')[1]}&format=png`;
};
