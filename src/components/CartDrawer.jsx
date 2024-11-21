import React from 'react';
import { X, Plus, Minus, ShoppingCart, Trash } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
  <div className="flex gap-4 p-2 border rounded bg-white">
    <img
      src={item.imageUrl}
      alt={item.name}
      className="w-20 h-20 object-cover rounded"
    />
    <div className="flex-1">
      <h4 className="font-medium">{item.name}</h4>
      {item.selectedSize && (
        <p className="text-sm text-gray-600">Tamaño: {item.selectedSize}</p>
      )}
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity - 1, item.selectedSize)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item._id, item.quantity + 1, item.selectedSize)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => onRemove(item._id, item.selectedSize)}
          className="ml-auto p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  items = [], 
  onUpdateQuantity, 
  onRemove,
  onQuotationRequest,
  onClearCart // Nueva prop para limpiar carrito
}) => (
  <>
    {isOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-25 z-30"
        onClick={onClose}
      />
    )}

    <div className={`fixed top-0 bottom-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-40`}>
      <div className="h-full flex flex-col p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Carrito de Cotización</h3>
          <button
            onClick={onClose}
            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            No hay productos en el carrito
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4">
              {items.map((item) => (
                <CartItem
                  key={`${item._id}-${item.selectedSize || 'default'}`}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemove}
                />
              ))}
            </div>
            
            <div className="mt-4 space-y-2">
              <button
                onClick={onClearCart}
                className="w-full py-2 px-4 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
              >
                <Trash className="w-4 h-4" />
                Limpiar Carrito
              </button>

              <button
                onClick={() => {
                  onClose();
                  onQuotationRequest();
                }}
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Solicitar Cotización
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  </>
);

export default CartDrawer;