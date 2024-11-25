import React, { memo, useState, useEffect } from 'react';
import { Star, Plus, X } from 'lucide-react';
import CategoryAutocomplete from '../CategoryAutocomplete';

const SizeVariantsManager = memo(({ variants, setVariants }) => {
  const [newSize, setNewSize] = useState('');

  const addVariant = () => {
    if (newSize.trim()) {
      setVariants([...variants, { size: newSize, isAvailable: true }]);
      setNewSize('');
    }
  };

  const removeVariant = (index) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const toggleAvailability = (index) => {
    setVariants(variants.map((variant, i) => 
      i === index ? { ...variant, isAvailable: !variant.isAvailable } : variant
    ));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addVariant();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ej: 30x30 cm"
          className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-green-500"
        />
        <button
          type="button"
          onClick={addVariant}
          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      {variants.length === 0 && (
        <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No hay variantes agregadas</p>
          <p className="text-sm text-red-500 mt-1">Debe agregar al menos una variante</p>
        </div>
      )}
      
      <div className="space-y-2">
        {variants.map((variant, index) => (
          <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
            <span className="flex-1">{variant.size}</span>
            <button
              type="button"
              onClick={() => toggleAvailability(index)}
              className={`px-2 py-1 rounded-md text-sm ${
                variant.isAvailable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {variant.isAvailable ? 'Disponible' : 'No disponible'}
            </button>
            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="p-1 text-red-500 hover:bg-red-50 rounded-full"
              disabled={variants.length === 1}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

const ProductForm = ({
  formData,
  setFormData,
  imagePreview,
  onSubmit,
  onCancel,
  isEditing = false,
  onImageChange
}) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        if (!response.ok) throw new Error('Error al cargar productos');
        const products = await response.json();
        
        const uniqueCategories = [...new Set(products.map(product => product.category))]
          .filter(Boolean)
          .sort();
        
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!formData.sizeVariants) {
      setFormData(prev => ({
        ...prev,
        hasSizeVariants: true,
        sizeVariants: []
      }));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.sizeVariants.length === 0) {
      alert('Debe agregar al menos un variante al producto');
      return;
    }

    const hasValidSizes = formData.sizeVariants.every(variant => 
      variant.size && variant.size.trim() !== ''
    );

    if (!hasValidSizes) {
      alert('Por favor, asegúrese de que todos los variantes sean válidos');
      return;
    }

    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Producto
          </label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <CategoryAutocomplete
            value={formData.category}
            onChange={(value) => setFormData({...formData, category: value})}
            categories={categories}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            required
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagen
          </label>
          <input
            type="file"
            className="w-full"
            accept="image/*"
            onChange={(e) => onImageChange(e)}
            required={!isEditing}
          />
          {imagePreview && (
            <div className="mt-2 relative w-32 h-32">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Variantes disponibles <span className="text-red-500">*</span>
          </label>
          <SizeVariantsManager
            variants={formData.sizeVariants}
            setVariants={(newVariants) => setFormData({...formData, sizeVariants: newVariants})}
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({...formData, featured: e.target.checked})}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              Marcar como destacado
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          {isEditing ? 'Guardar Cambios' : 'Añadir Producto'}
        </button>
      </div>
    </form>
  );
};

export default memo(ProductForm);