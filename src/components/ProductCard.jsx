import React from 'react';

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <img src="/api/placeholder/400/300" alt={product.name} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 text-sm md:text-base">{product.description}</p>
    </div>
  </div>
);

export default ProductCard;