import React, { useState, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { X, Send, ChevronDown } from 'lucide-react';

const QuotationForm = ({ onClose, onSuccess }) => {
  const { cartItems, clearCart } = useCart();
  const [selectedCountry, setSelectedCountry] = useState('+56');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    rut: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });

  const countries = [
    { code: '+56', name: 'Chile', flag: '🇨🇱' },
    { code: '+54', name: 'Argentina', flag: '🇦🇷' },
    { code: '+51', name: 'Perú', flag: '🇵🇪' },
    { code: '+57', name: 'Colombia', flag: '🇨🇴' },
    { code: '+55', name: 'Brasil', flag: '🇧🇷' },
  ];

  const validateRut = (rut) => {
    if (typeof rut !== 'string') return false;
    
    // Limpiar el RUT
    const cleanRut = rut.replace(/[.-]/g, '').toUpperCase();
    
    // Verificar longitud
    if (cleanRut.length < 8 || cleanRut.length > 9) return false;
    
    // Separar Cuerpo y Dígito Verificador
    const cuerpo = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);
    
    // Calcular Dígito Verificador
    let suma = 0;
    let multiplicador = 2;
    
    // Para cada dígito del Cuerpo
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    // Calcular Dígito Verificador en base a Módulo 11
    let dvEsperado = 11 - (suma % 11);
    
    // Casos Especiales
    if (dvEsperado === 11) dvEsperado = '0';
    else if (dvEsperado === 10) dvEsperado = 'K';
    else dvEsperado = String(dvEsperado);
    
    // Validar que el Dígito Verificador coincida
    return dvEsperado === dv;
  };  

  const formatRut = (rutValue) => {
    let value = rutValue.replace(/\D/g, '');
    
    if (!value) return '';
    if (value.length > 9) value = value.slice(0, 9);

    const dv = value.slice(-1);
    let numbers = value.slice(0, -1);

    let formatted = '';
    for (let i = numbers.length - 1, j = 0; i >= 0; i--, j++) {
      if (j % 3 === 0 && j !== 0) formatted = '.' + formatted;
      formatted = numbers[i] + formatted;
    }

    return formatted ? `${formatted}-${dv}` : value;
  };

  const handleRutChange = (e) => {
    const raw = e.target.value.replace(/[.-]/g, '');
    const formatted = formatRut(raw);
    setFormData(prev => ({ ...prev, rut: formatted }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 9) {
      setFormData(prev => ({ ...prev, phone: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;

     // Validaciones
  if (!validateRut(formData.rut)) {
    setError('El RUT ingresado no es válido');
    return;
  }

  if (formData.phone.length !== 9) {
    setError('El número de teléfono debe tener 9 dígitos');
    return;
  }
    
  setLoading(true);
  setError('');

  try {
    const emailBody = {
      ...formData,
      phone: `${selectedCountry}${formData.phone}`,
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        category: item.category,
        selectedSize: item.selectedSize
      }))
    };

    const response = await fetch(`${import.meta.env.VITE_API_URL}/send-quotation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(emailBody)
    });

    if (!response.ok) {
      throw new Error('Error al enviar la cotización');
    }

    setSuccess(true);
    clearCart();

  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" 
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Formulario de Cotización</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded animate-fade-in-up">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center p-4">
            <div className="text-green-500 mb-2 font-semibold">
              ¡Cotización enviada exitosamente!
            </div>
            <p className="text-gray-600">
              Nos pondremos en contacto contigo pronto.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" translate="no">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RUT *
              </label>
              <input
                type="text"
                name="rut"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                value={formData.rut}
                onChange={handleRutChange}
                placeholder="12.345.678-9"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="firstName"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido *
              </label>
              <input
                type="text"
                name="lastName"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <div className="flex gap-2">
                <div className="relative">
                <select
  value={selectedCountry}
  onChange={(e) => setSelectedCountry(e.target.value)}
  className="appearance-none w-24 p-2 border rounded focus:ring-2 focus:ring-green-500 pr-8"
>
  {countries.map(country => (
    <option key={country.code} value={country.code}>
      {country.flag} {country.code}
    </option>
  ))}
</select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="flex-1 p-2 border rounded focus:ring-2 focus:ring-green-500"
                  placeholder="912345678"
                  maxLength="9"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico *
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2">Productos en la cotización:</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={`${item._id}-${item.selectedSize || 'default'}`} 
                       className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <div className="flex-1">
                      <span className="font-medium">{item.name}</span>
                      {item.selectedSize && (
                        <span className="text-sm text-gray-500 ml-2">
                          (Tamaño: {item.selectedSize})
                        </span>
                      )}
                    </div>
                    <span className="text-gray-600 ml-4">Cantidad: {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-green-500 text-white rounded hover:bg-green-600 
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                  Enviando...
                </span>
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