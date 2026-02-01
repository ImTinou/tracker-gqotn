// Vercel Serverless Function to scrape Rolimons sales history
// Gets real price history data from itemsales page
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
    const response = await fetch(`https://www.rolimons.com/itemsales/${itemId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Rolimons returned status ${response.status}`);
    }

    const html = await response.text();

    // Extract JavaScript arrays containing sale data
    const timestampMatch = html.match(/var\s+timestamp_list\s*=\s*\[([\d,\s]+)\]/);
    const priceMatch = html.match(/var\s+sale_price_list\s*=\s*\[([\d,\s]+)\]/);
    const saleIdMatch = html.match(/var\s+sale_id_list\s*=\s*\[([\d,\s]+)\]/);

    let timestamps = [];
    let prices = [];
    let saleIds = [];

    if (timestampMatch) {
      timestamps = timestampMatch[1].split(',').map(t => parseInt(t.trim())).filter(t => !isNaN(t));
    }

    if (priceMatch) {
      prices = priceMatch[1].split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p));
    }

    if (saleIdMatch) {
      saleIds = saleIdMatch[1].split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    }

    // Extract aggregate statistics
    const extractStat = (pattern) => {
      const match = html.match(pattern);
      return match ? parseInt(match[1].replace(/,/g, '')) : 0;
    };

    const pastDaySales = extractStat(/Past Day Sales[\s\S]*?<span[^>]*>([0-9,]+)<\/span>/);
    const pastWeekSales = extractStat(/Past Week Sales[\s\S]*?<span[^>]*>([0-9,]+)<\/span>/);
    const pastMonthSales = extractStat(/Past Month Sales[\s\S]*?<span[^>]*>([0-9,]+)<\/span>/);
    const allTimeSales = extractStat(/All-Time Tracked Sales[\s\S]*?<span[^>]*>([0-9,]+)<\/span>/);
    const activeSellers = extractStat(/Active Sellers[\s\S]*?<span[^>]*>([0-9,]+)<\/span>/);

    const bestPriceMatch = html.match(/Best Price[\s\S]*?<span[^>]*>([0-9,]+)<\/span>/);
    const bestPrice = bestPriceMatch ? parseInt(bestPriceMatch[1].replace(/,/g, '')) : null;

    // Build priceDataPoints array from timestamps and prices
    const priceDataPoints = [];
    const minLength = Math.min(timestamps.length, prices.length);

    for (let i = 0; i < minLength; i++) {
      priceDataPoints.push({
        value: prices[i],
        date: new Date(timestamps[i] * 1000).toISOString(), // Convert Unix to ISO
        saleId: saleIds[i] || null,
      });
    }

    // Sort by date (oldest first)
    priceDataPoints.sort((a, b) => new Date(a.date) - new Date(b.date));

    const salesData = {
      priceDataPoints,
      stats: {
        pastDaySales,
        pastWeekSales,
        pastMonthSales,
        allTimeSales,
        activeSellers,
        bestPrice,
        totalDataPoints: priceDataPoints.length,
      },
      lastUpdated: new Date().toISOString(),
    };

    return res.status(200).json(salesData);
  } catch (error) {
    console.error('Error fetching sales data from Rolimons:', error);
    return res.status(500).json({
      error: 'Failed to fetch sales data from Rolimons',
      details: error.message
    });
  }
}
