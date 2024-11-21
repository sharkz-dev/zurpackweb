import React from 'react';
import { X } from 'lucide-react';

const SizeSelectorModal = ({ 
  product, 
  onClose, 
  onConfirm, 
  selectedSize, 
  onSizeSelect,
  error 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSize) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Seleccionar tamaño
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-20 h-20 object-contain"
            />
            <div>
              <h4 className="font-medium text-gray-900">{product.name}</h4>
              <span className="text-sm text-gray-500">{product.category}</span>
            </div>
          </div>

          <select
            value={selectedSize || ''}
            onChange={(e) => onSizeSelect(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent mb-2"
          >
            <option value="">Seleccionar tamaño</option>
            {product.sizeVariants.map((variant) => (
              <option 
                key={variant.size} 
                value={variant.size}
                disabled={!variant.isAvailable}
              >
                {variant.size} {!variant.isAvailable && '(No disponible)'}
              </option>
            ))}
          </select>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedSize}
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeSelectorModal;