import { ExternalLink, RefreshCw } from 'lucide-react';
import { formatRelativeTime } from '../utils/dateHelpers';
import { getItemThumbnail } from '../services/robloxApi';
import { ITEM_CONFIG } from '../constants/itemConfig';

const ItemHeader = ({ itemData, lastUpdated, onRefresh, isRefreshing }) => {
  if (!itemData) return null;

  const itemName = itemData.name || ITEM_CONFIG.name;
  const assetId = itemData.assetId || ITEM_CONFIG.assetId;
  const thumbnailUrl = getItemThumbnail(assetId);

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Item Thumbnail */}
            <div className="flex-shrink-0">
              <img
                src={thumbnailUrl}
                alt={itemName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg shadow-md object-cover bg-gray-100"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>

            {/* Item Info */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {itemName}
              </h1>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span>Asset ID: {assetId}</span>
                {itemData.acronym && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {itemData.acronym}
                  </span>
                )}
                {itemData.rare && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    Rare
                  </span>
                )}
              </div>
              <div className="mt-2">
                <a
                  href={`https://www.roblox.com/catalog/${assetId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  View on Roblox
                  <ExternalLink className="ml-1 w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Refresh Button & Last Updated */}
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            {lastUpdated && (
              <span className="text-xs text-gray-500">
                Updated {formatRelativeTime(lastUpdated)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemHeader;
