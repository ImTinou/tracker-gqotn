// Vercel Serverless Function to proxy Roblox Thumbnail API
// Fixes CORS issues from GitHub Pages
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { assetId } = req.query;

  if (!assetId) {
    return res.status(400).json({ error: 'assetId parameter is required' });
  }

  try {
    // Fetch from Roblox Thumbnails API
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&returnPolicy=PlaceHolder&size=420x420&format=Png`
    );

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return res.status(200).json({
        imageUrl: data.data[0].imageUrl,
        state: data.data[0].state,
      });
    }

    return res.status(404).json({ error: 'Thumbnail not found' });
  } catch (error) {
    console.error('Error fetching thumbnail:', error);
    return res.status(500).json({
      error: 'Failed to fetch thumbnail',
      details: error.message,
    });
  }
}
