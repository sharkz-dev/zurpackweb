import React, { memo } from 'react';
import { Pencil, Trash2, Star } from 'lucide-react';

const SizeVariantBadges = memo(({ variants }) => (
  <div className="flex flex-wrap gap-2 mt-1">
    {variants.map((variant, index) => (
      <span
        key={index}
        className={`text-xs px-2 py-1 rounded-full ${
          variant.isAvailable 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {variant.size}
      </span>
    ))}
  </div>
));

const ProductCard = memo(({ product, onEdit, onDelete }) => (
  <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Imagen del producto */}
      <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain p-2"
        />
      </div>
      
      {/* Información del producto */}
      <div className="flex-1">
        <div className="flex flex-wrap items-start gap-2 mb-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          {product.featured && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              Destacado
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
        <p className="text-gray-700 text-sm line-clamp-2 mb-2">{product.description}</p>
        
        {product.hasSizeVariants && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-600">Tamaños:</p>
            <SizeVariantBadges variants={product.sizeVariants} />
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex sm:flex-col gap-2">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Editar producto"
        >
          <Pencil className="w-4 h-4" />
          <span className="sm:hidden">Editar</span>
        </button>
        <button
          onClick={() => {
            if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
              onDelete(product._id);
            }
          }}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Eliminar producto"
        >
          <Trash2 className="w-4 h-4" />
          <span className="sm:hidden">Eliminar</span>
        </button>
      </div>
    </div>
  </div>
));

const ProductTable = ({ products, onEdit, onDelete }) => {
  if (!products.length) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default memo(ProductTable);