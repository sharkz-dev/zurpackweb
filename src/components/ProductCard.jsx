import React, { memo, useState } from 'react';
import { Star, Plus, Minus, X } from 'lucide-react';

// Componente Modal para selección de tamaño
const SizeSelectorModal = ({ 
  product, 
  onClose, 
  onConfirm, 
  selectedSize, 
  onSizeSelect,
  error 
}) => {
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
            onClick={onConfirm}
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

// Componente para seleccionar cantidad
const QuantitySelector = ({ quantity, onQuantityChange }) => (
  <div className="flex items-center gap-1">
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onQuantityChange(Math.max(1, quantity - 1));
      }}
      className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
    >
      <Minus className="w-4 h-4" />
    </button>
    <input
      type="number"
      min="1"
      value={quantity}
      onChange={(e) => {
        e.stopPropagation();
        onQuantityChange(parseInt(e.target.value) || 1);
      }}
      className="w-14 text-center border rounded py-1 text-sm"
      onClick={(e) => e.stopPropagation()}
    />
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onQuantityChange(quantity + 1);
      }}
      className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
    >
      <Plus className="w-4 h-4" />
    </button>
  </div>
);

// Componente principal ProductCard
const ProductCard = ({
  product,
  onImageClick,
  onProductClick,
  onAddToCart,
  selectedSize,
  onSizeSelect,
  sizeError,
  quantity,
  onQuantityChange
}) => {
  const [showSizeModal, setShowSizeModal] = useState(false);

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (product.hasSizeVariants) {
      setShowSizeModal(true);
    } else {
      onAddToCart(product);
    }
  };

  const handleSizeConfirm = () => {
    onAddToCart(product);
    setShowSizeModal(false);
  };

  return (
    <>
      <div className="bg-white border rounded-lg overflow-hidden p-4 flex flex-col">
        <div 
          className="relative flex justify-center mb-4 cursor-pointer"
          onClick={() => onProductClick(product)}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-48 object-contain"
            onClick={(e) => {
              e.stopPropagation();
              onImageClick(product.imageUrl);
            }}
          />
          {product.featured && (
            <div className="absolute top-0 left-0 bg-yellow-400 text-white px-2 py-1 text-xs rounded-br">
              <Star size={12} fill="currentColor" className="inline mr-1" />
              Destacado
            </div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            {product.name}
          </h2>
          
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-3">
            {product.category}
          </span>
          
          <div className="mt-auto">
            <button 
              onClick={() => onProductClick(product)}
              className="w-full bg-green-600 text-white py-2 rounded font-medium text-sm mb-2 hover:bg-green-700"
            >
              VER PRODUCTO
            </button>
            
            <div className="flex justify-center mb-2">
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={onQuantityChange}
              />
            </div>
            
            <button
              onClick={handleAddToCartClick}
              className="w-full bg-gray-100 text-gray-800 py-2 rounded font-medium text-sm hover:bg-gray-200"
            >
              AÑADIR A LA COTIZACIÓN
            </button>
          </div>
        </div>
      </div>

      {/* Modal de selección de tamaño */}
      {showSizeModal && (
        <SizeSelectorModal
          product={product}
          onClose={() => setShowSizeModal(false)}
          onConfirm={handleSizeConfirm}
          selectedSize={selectedSize}
          onSizeSelect={onSizeSelect}
          error={sizeError}
        />
      )}
    </>
  );
};

export default memo(ProductCard);