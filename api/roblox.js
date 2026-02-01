// Vercel Serverless Function to proxy Roblox Economy API
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { assetId } = req.query;

  if (!assetId) {
    return res.status(400).json({
      error: 'Missing assetId parameter'
    });
  }

  try {
    const response = await fetch(
      `https://economy.roblox.com/v1/assets/${assetId}/resale-data`
    );

    if (!response.ok) {
      throw new Error(`Roblox API returned ${response.status}`);
    }

    const data = await response.json();

    // Return the data with CORS headers
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching from Roblox:', error);
    return res.status(500).json({
      error: 'Failed to fetch from Roblox API',
      message: error.message
    });
  }
}
