import React from 'react';
import { ChevronDown } from 'lucide-react';

const SizeSelector = ({ 
  variants, 
  onSelect, 
  selectedSize,
  disabled = false,
  error = null,
  className = '',
  required = false
}) => {
  if (!variants || variants.length === 0) {
    return null;
  }

  const availableVariants = variants.filter(variant => variant.isAvailable);

  return (
    <div className={`relative w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Tamaño {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <select
          value={selectedSize || ''}
          onChange={(e) => onSelect(e.target.value)}
          disabled={disabled || availableVariants.length === 0}
          required={required}
          className={`
            w-full p-2 pr-8 border rounded-md appearance-none bg-white
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            transition-colors duration-200
          `}
        >
          <option value="">Seleccionar variante</option>
          {variants.map((variant, index) => (
            <option 
              key={index} 
              value={variant.size} 
              disabled={!variant.isAvailable}
              className={!variant.isAvailable ? 'text-gray-400' : ''}
            >
              {variant.size} {!variant.isAvailable && '(No disponible)'}
            </option>
          ))}
        </select>
        
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
      </div>

      {/* Mensajes de error o ayuda */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Mensaje cuando no hay tamaños disponibles */}
      {availableVariants.length === 0 && variants.length > 0 && (
        <p className="mt-1 text-sm text-amber-600">
          No hay variantes disponibles actualmente
        </p>
      )}

      {/* Contador de opciones disponibles */}
      {availableVariants.length > 0 && (
        <p className="mt-1 text-sm text-gray-500">
          {availableVariants.length} variante{availableVariants.length !== 1 ? 's' : ''} disponible{availableVariants.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};

export default SizeSelector;