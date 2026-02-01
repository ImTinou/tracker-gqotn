import { useState } from 'react';
import { ArrowUp, ArrowDown, Minus, Download } from 'lucide-react';
import { formatRobux, formatPercent, getTrendColor } from '../utils/formatters';
import { formatDate, formatRelativeTime } from '../utils/dateHelpers';

const RecentSales = ({ priceDataPoints }) => {
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'price'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [displayCount, setDisplayCount] = useState(20);

  if (!priceDataPoints || priceDataPoints.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-white mb-4">Recent Sales</h2>
        <div className="text-center text-gray-400 py-8">
          No recent sales data available
        </div>
      </div>
    );
  }

  // Calculate price changes
  const salesWithChanges = priceDataPoints.map((sale, index) => {
    if (index === 0) {
      return { ...sale, change: 0, changePercent: 0 };
    }

    const previousPrice = priceDataPoints[index - 1].value;
    const change = sale.value - previousPrice;
    const changePercent = previousPrice !== 0 ? (change / previousPrice) * 100 : 0;

    return {
      ...sale,
      change,
      changePercent,
    };
  });

  // Sort data
  const sortedSales = [...salesWithChanges].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    } else if (sortBy === 'price') {
      return sortOrder === 'desc' ? b.value - a.value : a.value - b.value;
    }
    return 0;
  });

  // Limit displayed sales
  const displayedSales = sortedSales.slice(0, displayCount);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Price (R$)', 'Change (R$)', 'Change (%)'];
    const rows = salesWithChanges.map((sale) => [
      formatDate(sale.date),
      sale.value,
      sale.change,
      sale.changePercent.toFixed(2),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gqotn-sales-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getTrendIcon = (change) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-400" />;
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-white">Recent Sales</h2>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center px-3 py-2 border border-white/20 rounded-md text-sm font-medium text-gray-300 bg-white/10 hover:bg-white/20"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              <th
                onClick={() => handleSort('date')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10"
              >
                <div className="flex items-center">
                  Date/Time
                  {sortBy === 'date' && (
                    sortOrder === 'desc' ? <ArrowDown className="ml-1 w-3 h-3" /> : <ArrowUp className="ml-1 w-3 h-3" />
                  )}
                </div>
              </th>
              <th
                onClick={() => handleSort('price')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/10"
              >
                <div className="flex items-center">
                  Price
                  {sortBy === 'price' && (
                    sortOrder === 'desc' ? <ArrowDown className="ml-1 w-3 h-3" /> : <ArrowUp className="ml-1 w-3 h-3" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Time Ago
              </th>
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-white/10">
            {displayedSales.map((sale, index) => (
              <tr key={index} className="hover:bg-white/5">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {formatDate(sale.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {formatRobux(sale.value)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {sale.change !== 0 ? (
                    <div className="flex items-center">
                      {getTrendIcon(sale.change)}
                      <span className={`ml-1 ${getTrendColor(sale.change)}`}>
                        {formatRobux(Math.abs(sale.change))}
                        <span className="ml-1 text-xs">
                          ({formatPercent(Math.abs(sale.changePercent))})
                        </span>
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {formatRelativeTime(sale.date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More */}
      {displayCount < salesWithChanges.length && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setDisplayCount(displayCount + 20)}
            className="inline-flex items-center px-4 py-2 border border-white/20 rounded-md text-sm font-medium text-gray-300 bg-white/10 hover:bg-white/20"
          >
            Load More ({salesWithChanges.length - displayCount} remaining)
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="mt-4 text-sm text-gray-400 text-center">
        Showing {displayedSales.length} of {salesWithChanges.length} sales
      </div>
    </div>
  );
};

export default RecentSales;
