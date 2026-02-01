/**
 * Format a number as Robux currency
 * @param {number} value - The value to format
 * @returns {string} Formatted currency string
 */
export const formatRobux = (value) => {
  if (value === null || value === undefined) return 'N/A';

  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ' R$';
};

/**
 * Format a number with thousands separator
 * @param {number} value - The value to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return 'N/A';

  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Format a percentage value
 * @param {number} value - The percentage value
 * @param {number} decimals - Number of decimal places (default 2)
 * @returns {string} Formatted percentage string
 */
export const formatPercent = (value, decimals = 2) => {
  if (value === null || value === undefined) return 'N/A';

  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

/**
 * Format a large number to compact form (K, M, B)
 * @param {number} value - The value to format
 * @returns {string} Compact number string
 */
export const formatCompact = (value) => {
  if (value === null || value === undefined) return 'N/A';

  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + 'B';
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + 'M';
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + 'K';
  }
  return value.toString();
};

/**
 * Get color class based on value trend
 * @param {number} value - The value to check
 * @returns {string} Tailwind color class
 */
export const getTrendColor = (value) => {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
};

/**
 * Get background color class based on value trend
 * @param {number} value - The value to check
 * @returns {string} Tailwind background color class
 */
export const getTrendBgColor = (value) => {
  if (value > 0) return 'bg-green-50 text-green-700';
  if (value < 0) return 'bg-red-50 text-red-700';
  return 'bg-gray-50 text-gray-700';
};
