import { useState, useEffect } from 'react';
import axios from 'axios';

const ItemImage = ({ assetId, className }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        // Use Roblox Thumbnails API v1
        const response = await axios.get(
          `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`
        );

        if (response.data?.data?.[0]?.imageUrl) {
          setImageUrl(response.data.data[0].imageUrl);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching thumbnail:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchThumbnail();
  }, [assetId]);

  if (loading) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center`}>
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`${className} bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center`}>
        <div className="text-white font-bold text-2xl">GQOTN</div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Green Queen of the Night"
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default ItemImage;
