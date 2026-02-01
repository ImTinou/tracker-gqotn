import { useState, useEffect, useCallback } from 'react';
import { fetchCompleteMarketData } from '../services/robloxApi';
import { ITEM_CONFIG } from '../constants/itemConfig';

/**
 * Custom hook to fetch and manage item market data
 * @param {boolean} autoRefresh - Enable auto-refresh (default: true)
 * @returns {Object} Market data and loading state
 */
export const useItemData = (autoRefresh = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const marketData = await fetchCompleteMarketData();
      setData(marketData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError(err.message || 'Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      console.log('Auto-refreshing data...');
      fetchData();
    }, ITEM_CONFIG.refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
  };
};
