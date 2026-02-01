import { useState } from 'react';

const ItemImage = ({ assetId, className }) => {
  const [error, setError] = useState(false);

  // Use direct Roblox CDN URL for asset thumbnails
  const imageUrl = `https://tr.rbxcdn.com/${assetId}/420/420/Hat/Png`;

  if (error) {
    return (
      <div className={`${className} bg-gradient-to-br from-purple-500 via-pink-500 to-blue-600 flex items-center justify-center`}>
        <div className="text-white font-bold text-2xl drop-shadow-lg">GQOTN</div>
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
