import { useState, useEffect } from 'react';

const ItemImage = ({ assetId, className, alt = 'Item' }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        setLoading(true);
        setError(false);

        // Use Roblox thumbnails API
        const response = await fetch(
          `https://thumbnails.roblox.com/v1/assets?assetIds=${assetId}&returnPolicy=PlaceHolder&size=420x420&format=Png`
        );

        const data = await response.json();

        if (data.data && data.data.length > 0 && data.data[0].imageUrl) {
          setImageUrl(data.data[0].imageUrl);
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
      <div className={`${className} bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center`}>
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`${className} bg-gradient-to-br from-purple-500 via-pink-500 to-blue-600 flex items-center justify-center`}>
        <div className="text-center p-4">
          <div className="text-white text-4xl mb-2">📦</div>
          <div className="text-white text-sm font-medium">No Image</div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

export default ItemImage;
