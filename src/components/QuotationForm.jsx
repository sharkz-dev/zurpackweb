import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Send, ShoppingCart } from 'lucide-react';

const QuotationForm = ({ onClose }) => {
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    rut: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const emailBody = {
        ...formData,
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          category: item.category,
          selectedSize: item.selectedSize  // Añadir esta línea
        }))
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/send-quotation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailBody)
      });

      if (!response.ok) {
        throw new Error('Error al enviar la cotización');
      }

      setSuccess(true);
      clearCart();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Formulario de Cotización</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center p-4">
            <div className="text-green-500 mb-2">
              ¡Cotización enviada exitosamente!
            </div>
            <p className="text-gray-600">
              Nos pondremos en contacto contigo pronto.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RUT
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                value={formData.rut}
                onChange={(e) => setFormData({...formData, rut: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="mt-4">
  <h3 className="font-medium mb-2">Productos en la cotización:</h3>
  <div className="space-y-2">
    {cartItems.map(item => (
      <div key={`${item._id}-${item.selectedSize || 'default'}`} className="flex justify-between items-center">
        <div>
          <span>{item.name}</span>
          {item.selectedSize && (
            <span className="text-sm text-gray-500 ml-2">
              (Tamaño: {item.selectedSize})
            </span>
          )}
        </div>
        <span className="text-gray-600">Cantidad: {item.quantity}</span>
      </div>
    ))}
  </div>
</div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Enviando...'
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Cotización
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuotationForm;