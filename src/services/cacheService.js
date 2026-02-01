/**
 * Cache Service - Manages localStorage caching with expiration
 */

const CACHE_PREFIX = 'gqotn_cache_';
const CACHE_VERSION = '6.0'; // Increment this to invalidate all caches - Added real sales history from Rolimons itemsales page
const VERSION_KEY = 'gqotn_cache_version';

/**
 * Check cache version and clear if outdated
 */
export const checkCacheVersion = () => {
  try {
    const currentVersion = localStorage.getItem(VERSION_KEY);
    if (currentVersion !== CACHE_VERSION) {
      console.log('Cache version outdated, clearing all cache...');
      clearAllCache();
      localStorage.setItem(VERSION_KEY, CACHE_VERSION);
    }
  } catch (error) {
    console.error('Error checking cache version:', error);
  }
};

/**
 * Store data in cache with expiration
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} expiresIn - Expiration time in milliseconds
 */
export const setCache = (key, data, expiresIn) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
      expiresIn,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

/**
 * Get data from cache if not expired
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if expired/not found
 */
export const getCache = (key) => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    if (!cached) return null;

    const cacheData = JSON.parse(cached);
    const now = Date.now();
    const age = now - cacheData.timestamp;

    if (age > cacheData.expiresIn) {
      // Cache expired
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }

    return cacheData.data;
  } catch (error) {
    console.error('Error getting cache:', error);
    return null;
  }
};

/**
 * Clear specific cache entry
 * @param {string} key - Cache key
 */
export const clearCache = (key) => {
  try {
    localStorage.removeItem(CACHE_PREFIX + key);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Clear all cached data
 */
export const clearAllCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
};

/**
 * Check if cache exists and is valid
 * @param {string} key - Cache key
 * @returns {boolean} True if cache is valid
 */
export const isCacheValid = (key) => {
  const cached = getCache(key);
  return cached !== null;
};
