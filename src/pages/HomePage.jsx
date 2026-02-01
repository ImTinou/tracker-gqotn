import React from 'react';
import { Link } from 'react-router-dom';
import { POPULAR_ITEMS } from '../constants/itemConfig';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Roblox Limited Tracker
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Track real-time market data, price history, and trends for your favorite Roblox Limited items
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="text-white font-medium">Live Price Updates</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                <span className="text-white font-medium">Historical Charts</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
                <Activity className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">Market Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          Tracked Items
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POPULAR_ITEMS.map((item) => (
            <Link
              key={item.id}
              to={`/item/${item.id}`}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50">
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-indigo-600/20 group-hover:via-purple-600/20 group-hover:to-pink-600/20 transition-all duration-300"></div>

                {/* Item Image */}
                <div className="relative aspect-square bg-gradient-to-br from-slate-800 to-slate-900 p-8">
                  <img
                    src={`https://tr.rbxcdn.com/${item.id}/420/420/Hat/Png`}
                    alt={item.name}
                    className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/420x420/1e293b/64748b?text=No+Image';
                    }}
                  />

                  {/* Acronym Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
                    <span className="text-white font-bold text-sm">{item.acronym}</span>
                  </div>
                </div>

                {/* Item Info */}
                <div className="relative p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Asset ID: {item.id}
                  </p>

                  {/* View Details Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-medium group-hover:text-purple-300 transition-colors">
                      View Details
                    </span>
                    <svg
                      className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-gray-400 text-sm">
          <p>Data sourced from Rolimons and Roblox Economy API</p>
          <p className="mt-2">Updates every 5 minutes</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
