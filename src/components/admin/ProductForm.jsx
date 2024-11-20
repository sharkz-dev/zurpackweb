import React, { memo } from 'react';
import { Star, Plus, X } from 'lucide-react';

const SizeVariantsManager = memo(({ variants, setVariants }) => {
  const [newSize, setNewSize] = React.useState('');

  const addVariant = () => {
    if (newSize.trim()) {
      setVariants([...variants, { size: newSize, isAvailable: true }]);
      setNewSize('');
    }
  };

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const toggleAvailability = (index) => {
    setVariants(variants.map((variant, i) => 
      i === index ? { ...variant, isAvailable: !variant.isAvailable } : variant
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newSize}
          onChange={(e) => setNewSize(e.target.value)}
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
  isEditing = false
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
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
        <input
          type="text"
          required
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
          value={formData.category}
          onChange={(e) => setFormData({...formData, category: e.target.value})}
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
          onChange={(e) => 
            setFormData({...formData, image: e.target.files[0]})
          }
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
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.hasSizeVariants}
            onChange={(e) => setFormData({
              ...formData,
              hasSizeVariants: e.target.checked,
              sizeVariants: e.target.checked ? formData.sizeVariants : []
            })}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Este producto tiene diferentes tamaños
          </span>
        </label>
      </div>

      {formData.hasSizeVariants && (
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tamaños disponibles
          </label>
          <SizeVariantsManager
            variants={formData.sizeVariants}
            setVariants={(newVariants) => setFormData({...formData, sizeVariants: newVariants})}
          />
        </div>
      )}

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

export default memo(ProductForm);