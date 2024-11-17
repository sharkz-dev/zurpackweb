import React from 'react';
import { X } from 'lucide-react';

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 p-2 bg-white rounded-full text-gray-600 hover:text-gray-900 shadow-lg transition-colors duration-300"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={imageUrl}
          alt="Enlarged view"
          className="w-full h-auto rounded-lg shadow-2xl"
        />
      </div>
    </div>
  );
};

export default ImageModal;