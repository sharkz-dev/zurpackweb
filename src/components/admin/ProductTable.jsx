import React, { memo, useState, useMemo } from 'react';
import { Pencil, Trash2, Star, Search, MoreVertical, X } from 'lucide-react';

const ActionButton = ({ icon: Icon, label, onClick, variant = "default" }) => {
  const colorClasses = {
    default: "text-gray-500 hover:bg-gray-100",
    edit: "text-blue-500 hover:bg-blue-50",
    delete: "text-red-500 hover:bg-red-50",
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full transition-colors ${colorClasses[variant]}`}
      title={label}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

const ActionModal = ({ product, onEdit, onDelete, onClose }) => (
  <>
    {/* Overlay con fondo oscuro */}
    <div 
      className="fixed inset-0 bg-black/50 z-50" 
      onClick={onClose}
    />
    
    {/* Modal flotante */}
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-xl shadow-xl animate-slide-up">
      <div className="max-w-lg mx-auto p-4">
        {/* Header del modal */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">Acciones</h3>
            <p className="text-sm text-gray-500 mt-1">{product.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Botones de acción */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onEdit(product);
              onClose();
            }}
            className="w-full p-3 flex items-center gap-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Pencil className="w-5 h-5" />
            <span className="font-medium">Editar producto</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
                onDelete(product._id);
                onClose();
              }
            }}
            className="w-full p-3 flex items-center gap-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Eliminar producto</span>
          </button>
        </div>

        {/* Botón cancelar */}
        <button
          onClick={onClose}
          className="w-full p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mt-4"
        >
          Cancelar
        </button>

        {/* Espacio extra para notch */}
        <div className="h-6" />
      </div>
    </div>
  </>
);

const ProductCard = ({ product, onEdit, onDelete, isMobile }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow">
      <div className="p-4">
        <div className="flex gap-4">
          {/* Imagen del producto */}
          <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Información del producto */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 truncate">
                    {product.name}
                  </h3>
                  {product.featured && (
                    <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  )}
                </div>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>

              {/* Menú de acciones */}
              {isMobile ? (
                <button
                  onClick={() => setShowActions(true)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex gap-1">
                  <ActionButton
                    icon={Pencil}
                    label="Editar"
                    onClick={() => onEdit(product)}
                    variant="edit"
                  />
                  <ActionButton
                    icon={Trash2}
                    label="Eliminar"
                    onClick={() => onDelete(product._id)}
                    variant="delete"
                  />
                </div>
              )}
            </div>

            {/* Descripción */}
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {product.description}
            </p>

            {/* Tamaños */}
            <div className="flex flex-wrap gap-1 mt-2">
              {product.sizeVariants.map((variant, idx) => (
                <span
                  key={variant._id || idx}
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    variant.isAvailable
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {variant.size}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de acciones */}
      {showActions && (
        <ActionModal
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onClose={() => setShowActions(false)}
        />
      )}
    </div>
  );
};

const ProductTable = ({ products, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = window.innerWidth < 768;

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    });
  }, [products, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Lista de productos */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No se encontraron productos</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
              isMobile={isMobile}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default memo(ProductTable);