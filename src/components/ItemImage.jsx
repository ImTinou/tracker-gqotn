import { useState, useEffect } from 'react';
import { ITEM_CONFIG } from '../constants/itemConfig';

const ItemImage = ({ assetId, className, alt = 'Item' }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        setLoading(true);
        setError(false);

        // Use Vercel proxy to avoid CORS issues
        const response = await fetch(
          `${ITEM_CONFIG.apiBaseUrl}/api/thumbnail?assetId=${assetId}`
        );

        const data = await response.json();

        if (data.imageUrl) {
          setImageUrl(data.imageUrl);
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
