// Configuration for tracked Roblox items

// Popular Roblox Limited items to track
export const POPULAR_ITEMS = [
  { id: '553970961', name: 'Green Queen of the Night', acronym: 'GQOTN' },
  { id: '10159600649', name: '8-Bit Royal Crown', acronym: '8BRC' },
  { id: '113598419875472', name: 'Helsworn Valkyrie', acronym: 'HELSV' },
];

export const ITEM_CONFIG = {
  // Asset ID - Green Queen of the Night
  assetId: '553970961',

  name: 'Green Queen of the Night',
  acronym: 'GQOTN',

  // API Configuration
  // Vercel serverless API for CORS-free access
  apiBaseUrl: import.meta.env.VITE_API_URL || 'https://tracker-tinou.vercel.app',

  apis: {
    rolimons: {
      baseUrl: 'https://www.rolimons.com',
      itemDetailsEndpoint: '/itemapi/itemdetails',
    },
    roblox: {
      catalogUrl: 'https://catalog.roblox.com/v1',
      economyUrl: 'https://economy.roblox.com/v1',
    },
  },

  // Cache configuration (in milliseconds)
  cache: {
    itemData: 60000,      // 1 minute
    priceHistory: 300000, // 5 minutes
  },

  // Auto-refresh interval (in milliseconds)
  refreshInterval: 60000, // 1 minute
};
