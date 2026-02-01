import axios from 'axios';
import { ITEM_CONFIG } from '../constants/itemConfig';
import { getCache, setCache } from './cacheService';

/**
 * Fetch item data from Rolimons API
 * @param {string} itemId - Optional item ID (defaults to ITEM_CONFIG.assetId)
 * @returns {Promise<Object>} Item data
 */
export const fetchItemData = async (itemId = ITEM_CONFIG.assetId) => {
  // Check cache first
  const cacheKey = `itemData_${itemId}`;
  const cached = getCache(cacheKey);
  if (cached) {
    console.log('Using cached item data for', itemId);
    return cached;
  }

  try {
    // First, try to get from the bulk API
    const bulkResponse = await axios.get(`${ITEM_CONFIG.apiBaseUrl}/api/rolimons`);
    const allItems = bulkResponse.data.items;
    const itemArray = allItems[itemId];

    if (itemArray) {
      // Found in bulk API - use array format
      const enrichedData = {
        assetId: itemId,
        name: itemArray[0],
        acronym: itemArray[1],
        rap: itemArray[2],
        value: itemArray[3],
        default_value: itemArray[4],
        demand: itemArray[5],
        trend: itemArray[6],
        rare: true,
        lastUpdated: new Date().toISOString(),
      };

      setCache(cacheKey, enrichedData, ITEM_CONFIG.cache.itemData);
      return enrichedData;
    }

    // Not in bulk API - try FULL scraping for all data (ownership, sales, etc.)
    console.log(`Item ${itemId} not in bulk API, trying full scraping...`);
    const fullResponse = await axios.get(
      `${ITEM_CONFIG.apiBaseUrl}/api/rolimons-full?itemId=${itemId}`
    );

    const enrichedData = fullResponse.data;
    setCache(cacheKey, enrichedData, ITEM_CONFIG.cache.itemData);
    return enrichedData;

  } catch (error) {
    console.error('Error fetching item data:', error);
    throw error;
  }
};

/**
 * Fetch price history from Roblox Resale API
 * Note: This may require a proxy due to CORS restrictions
 * @param {string} itemId - Optional item ID (defaults to ITEM_CONFIG.assetId)
 * @returns {Promise<Object>} Resale data with price history
 */
export const fetchPriceHistory = async (itemId = ITEM_CONFIG.assetId) => {
  // Check cache first
  const cacheKey = `priceHistory_${itemId}`;
  const cached = getCache(cacheKey);
  if (cached) {
    console.log('Using cached price history for', itemId);
    return cached;
  }

  try {
    // DON'T use Roblox API - it returns fake/incorrect/old data
    // Instead, use only Rolimons RAP/Value data which is accurate
    const itemData = await fetchItemData(itemId);

    // Create minimal data structure based on REAL Rolimons data only
    const now = new Date();
    const mockData = {
      assetStock: null,
      sales: null,
      numberRemaining: null,
      recentAveragePrice: itemData.rap,
      originalPrice: itemData.default_value || null,
      // Only provide current value as a single data point - no fake history
      priceDataPoints: [
        {
          value: itemData.value || itemData.rap,
          date: now.toISOString(),
        }
      ],
      volumeDataPoints: [],
      _isRolimonsOnly: true,
    };

    // Cache the data
    setCache(cacheKey, mockData, ITEM_CONFIG.cache.priceHistory);

    return mockData;
  } catch (error) {
    console.error('Error fetching price data:', error);
    throw error;
  }
};

/**
 * Generate mock price history data (fallback when API unavailable)
 * @param {string} itemId - Optional item ID (defaults to ITEM_CONFIG.assetId)
 * @returns {Object} Mock price history data
 */
const generateMockPriceHistory = async (itemId = ITEM_CONFIG.assetId) => {
  try {
    const itemData = await fetchItemData(itemId);

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
 * @param {string} itemId - Optional item ID (defaults to ITEM_CONFIG.assetId)
 * @returns {Promise<Object>} Complete market data
 */
export const fetchCompleteMarketData = async (itemId = ITEM_CONFIG.assetId) => {
  try {
    const [itemData, priceHistory] = await Promise.all([
      fetchItemData(itemId),
      fetchPriceHistory(itemId),
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
export const getItemThumbnail = (assetId = ITEM_CONFIG.assetId, size = '420') => {
  // Use Roblox thumbnail API - returns direct image URL
  return `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&returnPolicy=PlaceHolder&size=${size}x${size}&format=Png&isCircular=false`;
};
