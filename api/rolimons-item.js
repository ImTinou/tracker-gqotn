// Vercel Serverless Function to scrape individual Rolimons item pages
// This is needed for UGC Limiteds and newer items not in the itemdetails API
// Updated: 2026-02-01

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

    // Extract data from the HTML using regex patterns
    const extractValue = (pattern) => {
      const match = html.match(pattern);
      return match ? match[1] : null;
    };

    // Extract item name
    const nameMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/);
    const name = nameMatch ? nameMatch[1].trim() : null;

    // Extract acronym
    const acronymMatch = html.match(/var\s+item_acronym\s*=\s*"([^"]*)"/);
    const acronym = acronymMatch ? acronymMatch[1] : null;

    // Extract RAP (Recent Average Price)
    const rapMatch = html.match(/var\s+item_value\s*=\s*(\d+)/);
    const rap = rapMatch ? parseInt(rapMatch[1]) : null;

    // Extract value
    const valueMatch = html.match(/var\s+item_value\s*=\s*(\d+)/);
    const value = valueMatch ? parseInt(valueMatch[1]) : null;

    // Extract demand
    const demandMatch = html.match(/var\s+item_demand\s*=\s*(-?\d+)/);
    const demand = demandMatch ? parseInt(demandMatch[1]) : 0;

    // Extract trend
    const trendMatch = html.match(/var\s+item_trend\s*=\s*(-?\d+)/);
    const trend = trendMatch ? parseInt(trendMatch[1]) : 0;

    // Extract default value (original price)
    const defaultValueMatch = html.match(/var\s+item_default_value\s*=\s*(\d+)/);
    const default_value = defaultValueMatch ? parseInt(defaultValueMatch[1]) : null;

    const itemData = {
      assetId: itemId,
      name: name || `Item ${itemId}`,
      acronym: acronym || 'N/A',
      rap: rap || 0,
      value: value || rap || 0,
      default_value: default_value || 0,
      demand: demand,
      trend: trend,
      rare: true,
      lastUpdated: new Date().toISOString(),
    };

    return res.status(200).json(itemData);
  } catch (error) {
    console.error('Error fetching item from Rolimons:', error);
    return res.status(500).json({
      error: 'Failed to fetch item data from Rolimons',
      details: error.message
    });
  }
}
