// Configuration for the Green Queen of the Night item
// TODO: Replace with actual Asset ID from Roblox catalog or Rolimons

export const ITEM_CONFIG = {
  // Asset ID - Find this on Rolimons or Roblox catalog
  assetId: '1365767', // Placeholder - need to find actual ID

  name: 'Green Queen of the Night',
  acronym: 'GQOTN',

  // API Configuration
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
