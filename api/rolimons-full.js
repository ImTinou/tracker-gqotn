// Vercel Serverless Function to scrape FULL Rolimons data
// Gets ownership, sales, copies, and all other data from the item page
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { itemId } = req.query;

  if (!itemId) {
    return res.status(400).json({ error: 'itemId parameter is required' });
  }

  try {
    const response = await fetch(`https://www.rolimons.com/item/${itemId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Rolimons returned status ${response.status}`);
    }

    const html = await response.text();

    // Extract data using regex patterns
    const extractValue = (pattern, defaultValue = null) => {
      const match = html.match(pattern);
      return match ? match[1] : defaultValue;
    };

    const extractNumber = (pattern, defaultValue = 0) => {
      const match = html.match(pattern);
      return match ? parseInt(match[1].replace(/,/g, '')) : defaultValue;
    };

    // Basic item info
    const nameMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/);
    const name = nameMatch ? nameMatch[1].trim() : null;

    const acronymMatch = html.match(/var\s+item_acronym\s*=\s*"([^"]*)"/);
    const acronym = acronymMatch ? acronymMatch[1] : null;

    // Prices and values
    const rapMatch = html.match(/var\s+item_value\s*=\s*(\d+)/);
    const rap = rapMatch ? parseInt(rapMatch[1]) : 0;

    const valueMatch = html.match(/var\s+item_value\s*=\s*(\d+)/);
    const value = valueMatch ? parseInt(valueMatch[1]) : 0;

    const defaultValueMatch = html.match(/var\s+item_default_value\s*=\s*(\d+)/);
    const default_value = defaultValueMatch ? parseInt(defaultValueMatch[1]) : 0;

    // Demand and trend
    const demandMatch = html.match(/var\s+item_demand\s*=\s*(-?\d+)/);
    const demand = demandMatch ? parseInt(demandMatch[1]) : 0;

    const trendMatch = html.match(/var\s+item_trend\s*=\s*(-?\d+)/);
    const trend = trendMatch ? parseInt(trendMatch[1]) : 0;

    // Ownership data - extract from HTML
    const totalCopies = extractNumber(/Total Copies[\s\S]*?<span[^>]*>([0-9,]+)<\/span>/, null);
    const availableCopies = extractNumber(/Available Copies[\s\S]*?<span[^>]*>([0-9,]+)<\/span>/, null);
    const premiumCopies = extractNumber(/Premium Copies[\s\S]*?<span[^>]*>([0-9,]+)<\/span>/, null);
    const deletedCopies = extractNumber(/Deleted Copies[\s\S]*?<span[^>]*>([0-9,]+)<\/span>/, null);
    const owners = extractNumber(/Owners[\s\S]*?<span[^>]*>([0-9,]+)<\/span>/, null);
    const premiumOwners = extractNumber(/Premium Owners[\s\S]*?<span[^>]*>([0-9,]+)<\/span>/, null);
    const hoardedCopies = extractNumber(/Hoarded Copies[\s\S]*?<span[^>]*>([0-9,]+)<\/span>/, null);

    // Percent hoarded
    const percentHoardedMatch = html.match(/Percent Hoarded[\s\S]*?<span[^>]*>([\d.]+)%<\/span>/);
    const percentHoarded = percentHoardedMatch ? parseFloat(percentHoardedMatch[1]) : null;

    // Sales data
    const avgDailySalesMatch = html.match(/Avg Daily Sales[\s\S]*?<span[^>]*>([\d.]+)<\/span>/);
    const avgDailySales = avgDailySalesMatch ? parseFloat(avgDailySalesMatch[1]) : null;

    // RAP After Sale
    const rapAfterSaleMatch = html.match(/RAP After Sale[\s\S]*?<span[^>]*>([0-9,]+)<\/span>/);
    const rapAfterSale = rapAfterSaleMatch ? parseInt(rapAfterSaleMatch[1].replace(/,/g, '')) : null;

    const fullData = {
      assetId: itemId,
      name: name || `Item ${itemId}`,
      acronym: acronym || 'N/A',
      rap: rap,
      value: value,
      default_value: default_value,
      demand: demand,
      trend: trend,
      rare: true,

      // Ownership data
      ownership: {
        totalCopies,
        availableCopies,
        premiumCopies,
        deletedCopies,
        owners,
        premiumOwners,
        hoardedCopies,
        percentHoarded,
      },

      // Sales data
      sales: {
        avgDailySales,
        rapAfterSale,
      },

      lastUpdated: new Date().toISOString(),
    };

    return res.status(200).json(fullData);
  } catch (error) {
    console.error('Error fetching full data from Rolimons:', error);
    return res.status(500).json({
      error: 'Failed to fetch full data from Rolimons',
      details: error.message
    });
  }
}
