import { ExternalLink, RefreshCw, TrendingUp } from 'lucide-react';
import { formatRelativeTime } from '../utils/dateHelpers';
import { ITEM_CONFIG } from '../constants/itemConfig';
import ItemImage from './ItemImage';

const ItemHeader = ({ itemData, lastUpdated, onRefresh, isRefreshing }) => {
  if (!itemData) return null;

  const itemName = itemData.name || ITEM_CONFIG.name;
  const assetId = itemData.assetId || ITEM_CONFIG.assetId;

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <ItemImage
                assetId={assetId}
                className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg shadow-2xl object-cover bg-white/10 backdrop-blur-sm border-2 border-white/20"
              />
            </div>

            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg">
                  {itemName}
                </h1>
                <TrendingUp className="w-8 h-8 text-green-300 animate-pulse" />
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm border border-white/30">
                  Asset ID: {assetId}
                </span>
                {itemData.acronym && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-white shadow-lg">
                    {itemData.acronym}
                  </span>
                )}
                {itemData.rare && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg">
                    ✨ Rare
                  </span>
                )}
              </div>

              <div className="flex gap-4">
                <a
                  href={`https://www.roblox.com/catalog/${assetId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-white hover:text-blue-200 transition-colors group"
                >
                  <span className="border-b border-white/50 group-hover:border-blue-200">View on Roblox</span>
                  <ExternalLink className="ml-1 w-4 h-4" />
                </a>
                <a
                  href={`https://www.rolimons.com/item/${assetId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-white hover:text-green-200 transition-colors group"
                >
                  <span className="border-b border-white/50 group-hover:border-green-200">View on Rolimons</span>
                  <ExternalLink className="ml-1 w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end space-y-3">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center px-6 py-3 rounded-lg shadow-lg text-sm font-bold text-purple-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            {lastUpdated && (
              <span className="text-xs text-white/80 font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                🕐 Updated {formatRelativeTime(lastUpdated)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemHeader;
