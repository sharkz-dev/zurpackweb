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
        <div
          key={product._id}
          className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex gap-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                {product.featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Destacado
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{product.category}</p>
              <p className="text-gray-700 line-clamp-2">{product.description}</p>
              {product.hasSizeVariants && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-600">Tamaños:</p>
                  <SizeVariantBadges variants={product.sizeVariants} />
                </div>
              )}
            </div>
            <div className="flex gap-2 self-start">
              <button
                onClick={() => onEdit(product)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                title="Editar"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(product._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Eliminar"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(ProductTable);