import React, { memo, useState } from 'react';
import { Star, Plus, Minus, ShoppingCart, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({
  product,
  onImageClick,
  onAddToCart
}) => {
  const navigate = useNavigate();
  const [localSelectedSize, setLocalSelectedSize] = useState('');
  const [localQuantity, setLocalQuantity] = useState(1);
  const [showError, setShowError] = useState(false);

  const availableSizes = product.sizeVariants.filter(variant => variant.isAvailable);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.hasSizeVariants && !localSelectedSize) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    onAddToCart({
      ...product,
      selectedSize: localSelectedSize,
      quantity: localQuantity
    });
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (e.altKey || e.ctrlKey || e.shiftKey) {
      onImageClick && onImageClick(product.imageUrl);
    } else {
      navigate(`/catalogo/${product.slug}`);
    }
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden p-3 flex flex-col relative hover:shadow-lg transition-shadow duration-200 w-full max-w-xs">
      {/* Imagen y badge destacado */}
      <div className="relative flex justify-center mb-3">
        <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-36 w-full object-contain cursor-pointer transition-transform hover:scale-105 rounded-lg p-2"
            onClick={handleImageClick}
            title="Clic para ver detalles. Alt+Clic para zoom"
          />
        </div>
        {product.featured && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 text-xs rounded-lg">
            <Star size={12} fill="currentColor" className="inline mr-1" />
            Destacado
          </div>
        )}
      </div>
      
      {/* Título y categoría */}
      <div className="mb-3">
        <h2 className="text-base font-semibold text-gray-800 mb-1 cursor-pointer hover:text-green-600 line-clamp-2 min-h-[2.5rem]"
            onClick={() => navigate(`/catalogo/${product.slug}`)}>
          {product.name}
        </h2>
        
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          {product.category}
        </span>
      </div>

      {/* Botón Ver Detalles */}
      <button
        onClick={() => navigate(`/catalogo/${product.slug}`)}
        className="w-full bg-green-500 text-white hover:bg-green-600 py-1.5 px-4 rounded-lg transition-colors text-sm font-medium mb-3"
      >
        VER DETALLES
      </button>

      {/* Contenedor para tamaño y cantidad */}
      <div className="flex justify-between items-start mb-3 gap-2">
        {/* Selector de tamaño */}
        {product.hasSizeVariants && (
          <div className="w-[48%]">
            <select
              value={localSelectedSize}
              onChange={(e) => setLocalSelectedSize(e.target.value)}
              className={`w-full p-1.5 border rounded-md focus:ring-2 focus:ring-green-500 text-sm ${
                showError ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Tamaños</option>
              {availableSizes.map((variant) => (
                <option key={variant.size} value={variant.size}>
                  {variant.size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Selector de cantidad */}
        <div className={`flex items-center gap-1 justify-end ${product.hasSizeVariants ? 'w-[48%]' : 'w-full'}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLocalQuantity(Math.max(1, localQuantity - 1));
            }}
            className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200 flex-shrink-0"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            min="1"
            value={localQuantity}
            onChange={(e) => {
              e.stopPropagation();
              setLocalQuantity(Math.max(1, parseInt(e.target.value) || 1));
            }}
            className="w-12 text-center border rounded py-1 text-sm"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLocalQuantity(localQuantity + 1);
            }}
            className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Botón Añadir a Cotización */}
      <button
        onClick={handleAddToCart}
        className="w-full flex items-center justify-center gap-2 py-1.5 px-4 rounded-lg text-sm font-medium
                 bg-white text-green-600 border border-green-500 hover:bg-green-50 transition-colors"
      >
        <ShoppingCart className="w-4 h-4" />
        AÑADIR A COTIZACIÓN
      </button>

      {/* Mensaje de error */}
      {showError && (
        <div className="absolute top-2 left-2 right-2 z-10 animate-fade-in-up">
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Por favor seleccione un tamaño</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ProductCard);