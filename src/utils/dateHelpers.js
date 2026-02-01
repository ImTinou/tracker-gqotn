import { format, formatDistanceToNow, subDays, subHours, isAfter, isBefore, parseISO } from 'date-fns';

/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @param {string} formatString - Format string (default: 'MMM dd, yyyy HH:mm')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, formatString = 'MMM dd, yyyy HH:mm') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};

/**
 * Format a date as relative time (e.g., "2 hours ago")
 * @param {Date|string} date - The date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

/**
 * Get date range for a predefined period
 * @param {string} period - Period name ('24h', '7d', '30d', '90d', '1y', 'all')
 * @returns {{start: Date, end: Date}} Date range object
 */
export const getDateRange = (period) => {
  const end = new Date();
  let start;

  switch (period) {
    case '24h':
      start = subHours(end, 24);
      break;
    case '7d':
      start = subDays(end, 7);
      break;
    case '30d':
      start = subDays(end, 30);
      break;
    case '90d':
      start = subDays(end, 90);
      break;
    case '1y':
      start = subDays(end, 365);
      break;
    case 'all':
      start = new Date(2000, 0, 1); // Far past date
      break;
    default:
      start = subDays(end, 7);
  }

  return { start, end };
};

/**
 * Filter data by date range
 * @param {Array} data - Array of data with date field
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {string} dateField - Name of the date field (default: 'date')
 * @returns {Array} Filtered data
 */
export const filterByDateRange = (data, startDate, endDate, dateField = 'date') => {
  return data.filter((item) => {
    const itemDate = typeof item[dateField] === 'string' ? parseISO(item[dateField]) : item[dateField];
    return isAfter(itemDate, startDate) && isBefore(itemDate, endDate);
  });
};

/**
 * Group data by time period (day, week, month)
 * @param {Array} data - Array of data with date field
 * @param {string} period - Grouping period ('day', 'week', 'month')
 * @param {string} dateField - Name of the date field (default: 'date')
 * @returns {Object} Grouped data by period
 */
export const groupByPeriod = (data, period = 'day', dateField = 'date') => {
  const grouped = {};

  data.forEach((item) => {
    const itemDate = typeof item[dateField] === 'string' ? parseISO(item[dateField]) : item[dateField];
    let key;

    switch (period) {
      case 'day':
        key = format(itemDate, 'yyyy-MM-dd');
        break;
      case 'week':
        key = format(itemDate, 'yyyy-ww');
        break;
      case 'month':
        key = format(itemDate, 'yyyy-MM');
        break;
      default:
        key = format(itemDate, 'yyyy-MM-dd');
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });

  return grouped;
};

/**
 * Get time period labels for charts
 * @param {string} period - Period name
 * @returns {string} Display label
 */
export const getPeriodLabel = (period) => {
  const labels = {
    '24h': 'Last 24 Hours',
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
    '1y': 'Last Year',
    'all': 'All Time',
  };

  return labels[period] || 'Custom Range';
};
