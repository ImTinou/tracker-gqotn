// Vercel Serverless Function to proxy Rolimons API
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const response = await fetch('https://www.rolimons.com/itemapi/itemdetails');

    if (!response.ok) {
      throw new Error(`Rolimons API returned ${response.status}`);
    }

    const data = await response.json();

    // Return the data with CORS headers
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching from Rolimons:', error);
    return res.status(500).json({
      error: 'Failed to fetch from Rolimons API',
      message: error.message
    });
  }
}
