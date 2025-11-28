import React from 'react';

interface ImageCardProps {
  imageUrl: string;
  prompt: string;
  imageNumber: number;
}

const ImageCard: React.FC<ImageCardProps> = ({ imageUrl, prompt, imageNumber }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative w-full h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={prompt}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        ) : (
          <div className="text-gray-500 text-center p-4">
            Image loading or not available.
          </div>
        )}
        <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          #{imageNumber}
        </span>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-700 font-medium truncate">
          <span className="font-semibold text-gray-800">Prompt:</span> {prompt}
        </p>
      </div>
    </div>
  );
};

export default ImageCard;
