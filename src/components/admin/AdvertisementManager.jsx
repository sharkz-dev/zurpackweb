import React, { memo, useState } from 'react';
import { Plus, X } from 'lucide-react';

const AdvertisementForm = memo(({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEditing = false
}) => (
  <form onSubmit={onSubmit} className="space-y-4 p-4 bg-white rounded-lg border">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Texto del Anuncio
        </label>
        <input
          type="text"
          required
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
          value={formData.text}
          onChange={(e) => setFormData({...formData, text: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color de Fondo
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            required
            className="h-10 w-20"
            value={formData.backgroundColor}
            onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})}
          />
          <input
            type="text"
            value={formData.backgroundColor}
            onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})}
            className="flex-1 p-2 border rounded-md"
            placeholder="#000000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color del Texto
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            required
            className="h-10 w-20"
            value={formData.textColor}
            onChange={(e) => setFormData({...formData, textColor: e.target.value})}
          />
          <input
            type="text"
            value={formData.textColor}
            onChange={(e) => setFormData({...formData, textColor: e.target.value})}
            className="flex-1 p-2 border rounded-md"
            placeholder="#FFFFFF"
          />
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <span className="text-sm font-medium text-gray-700">Activar Anuncio</span>
        </label>
      </div>

      {/* Vista previa del anuncio */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Vista Previa
        </label>
        <div
          className="p-3 rounded text-center"
          style={{
            backgroundColor: formData.backgroundColor,
            color: formData.textColor
          }}
        >
          {formData.text || 'Vista previa del anuncio'}
        </div>
      </div>
    </div>

    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        {isEditing ? 'Guardar Cambios' : 'Crear Anuncio'}
      </button>
    </div>
  </form>
));

const AdvertisementItem = memo(({
  advertisement,
  onEdit,
  onDelete,
  onToggleActive
}) => (
  <div className="border rounded-lg overflow-hidden">
    <div
      className="p-4"
      style={{
        backgroundColor: advertisement.backgroundColor,
        color: advertisement.textColor
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{advertisement.text}</p>
          <p className="text-sm opacity-75">
            {advertisement.isActive ? 'Activo' : 'Inactivo'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onToggleActive(advertisement._id, !advertisement.isActive)}
            className={`px-3 py-1 rounded-md ${
              advertisement.isActive 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
            }`}
          >
            {advertisement.isActive ? 'Desactivar' : 'Activar'}
          </button>
          <button
            onClick={() => onEdit(advertisement)}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md"
          >
            Modificar
          </button>
          <button
            onClick={() => onDelete(advertisement._id)}
            className="bg-red-100 text-red-800 px-3 py-1 rounded-md"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
));

const AdvertisementManager = ({
  advertisements,
  onCreateAd,
  onUpdateAd,
  onDeleteAd,
  onToggleActive
}) => {
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState({
    text: '',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    isActive: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingAd) {
      await onUpdateAd(editingAd._id, formData);
      setEditingAd(null);
    } else {
      await onCreateAd(formData);
      setShowNewForm(false);
    }
    setFormData({
      text: '',
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      isActive: true
    });
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData({
      text: ad.text,
      backgroundColor: ad.backgroundColor,
      textColor: ad.textColor,
      isActive: ad.isActive
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Anuncios</h2>
        {!showNewForm && !editingAd && (
          <button
            onClick={() => setShowNewForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Anuncio
          </button>
        )}
      </div>

      {showNewForm && (
        <AdvertisementForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowNewForm(false);
            setFormData({
              text: '',
              backgroundColor: '#000000',
              textColor: '#FFFFFF',
              isActive: true
            });
          }}
        />
      )}

      <div className="space-y-4">
        {advertisements.map((ad) => (
          editingAd && editingAd._id === ad._id ? (
            <AdvertisementForm
              key={ad._id}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => {
                setEditingAd(null);
                setFormData({
                  text: '',
                  backgroundColor: '#000000',
                  textColor: '#FFFFFF',
                  isActive: true
                });
              }}
              isEditing
            />
          ) : (
            <AdvertisementItem
              key={ad._id}
              advertisement={ad}
              onEdit={handleEdit}
              onDelete={onDeleteAd}
              onToggleActive={onToggleActive}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default memo(AdvertisementManager);