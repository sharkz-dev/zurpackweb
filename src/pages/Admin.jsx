import React, { useState, useEffect } from 'react';
import { Loader, Pencil, Trash2, X, Check, Star, Plus } from 'lucide-react';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showNewAdForm, setShowNewAdForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [editAdFormData, setEditAdFormData] = useState({
    text: '',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    isActive: false
  });

  // Estado para el formulario de nuevo producto
  const initialFormState = {
    name: '',
    description: '',
    category: '',
    image: null,
    featured: false
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editFormData, setEditFormData] = useState(initialFormState);
  const [adFormData, setAdFormData] = useState({
    text: '',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    isActive: true
  });

  useEffect(() => {
    fetchProducts();
    fetchAdvertisements();
  }, []);

  const startEditingAd = (ad) => {
    setEditingAd(ad._id);
    setEditAdFormData({
      text: ad.text,
      backgroundColor: ad.backgroundColor,
      textColor: ad.textColor,
      isActive: ad.isActive
    });
  };
  
  const handleEditAdSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/advertisements/${editingAd}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(editAdFormData)
      });
  
      if (!response.ok) throw new Error('Error al actualizar el anuncio');
      
      showMessage('Anuncio actualizado correctamente');
      setEditingAd(null);
      fetchAdvertisements();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };
  
  const cancelEditingAd = () => {
    setEditingAd(null);
    setEditAdFormData({
      text: '',
      backgroundColor: '#000000',
      textColor: '#FFFFFF',
      isActive: false
    });
  };

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`);
      if (!response.ok) throw new Error('Error al cargar los productos');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdvertisements = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/advertisements`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (!response.ok) throw new Error('Error al cargar los anuncios');
      const data = await response.json();
      setAdvertisements(data);
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('featured', formData.featured);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear el producto');
      }

      showMessage('Producto añadido correctamente');
      setFormData(initialFormState);
      setImagePreview(null);
      fetchProducts();
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/advertisements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(adFormData)
      });

      if (!response.ok) throw new Error('Error al crear el anuncio');
      
      showMessage('Anuncio creado correctamente');
      setShowNewAdForm(false);
      setAdFormData({
        text: '',
        backgroundColor: '#000000',
        textColor: '#FFFFFF',
        isActive: true
      });
      fetchAdvertisements();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  const handleAdUpdate = async (id, isActive) => {
    try {
      const adToUpdate = advertisements.find(ad => ad._id === id);
      if (!adToUpdate) return;
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/advertisements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          text: adToUpdate.text,
          backgroundColor: adToUpdate.backgroundColor,
          textColor: adToUpdate.textColor,
          isActive: isActive
        })
      });
  
      if (!response.ok) throw new Error('Error al actualizar el anuncio');
      
      showMessage('Anuncio actualizado correctamente');
      fetchAdvertisements();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  const handleAdDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este anuncio?')) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/advertisements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar el anuncio');
      }
  
      showMessage('Anuncio eliminado correctamente');
      // Actualiza la lista de anuncios después de eliminar
      setAdvertisements(advertisements.filter(ad => ad._id !== id));
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  const handleUpdate = async (productId) => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('name', editFormData.name);
      formDataToSend.append('description', editFormData.description);
      formDataToSend.append('category', editFormData.category);
      formDataToSend.append('featured', editFormData.featured);
      if (editFormData.image) {
        formDataToSend.append('image', editFormData.image);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar el producto');
      }

      showMessage('Producto actualizado correctamente');
      setEditingProduct(null);
      setImagePreview(null);
      fetchProducts();
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar el producto');
      }

      showMessage('Producto eliminado correctamente');
      fetchProducts();
    } catch (error) {
      showMessage(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e, form) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (form === 'new') {
          setImagePreview(reader.result);
        } else if (form === 'edit') {
          setEditFormData(prev => ({
            ...prev,
            previewUrl: reader.result
          }));
        }
      };
      reader.readAsDataURL(file);
  
      if (form === 'new') {
        setFormData(prev => ({ ...prev, image: file }));
      } else {
        setEditFormData(prev => ({ ...prev, image: file }));
      }
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product._id);
    setEditFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      image: null,
      featured: product.featured,
      currentImageUrl: product.imageUrl
    });
    setImagePreview(null);
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setEditFormData(initialFormState);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>

        {message && (
          <div className={`p-4 mb-6 rounded-lg ${
            messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Sección de Anuncios */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Anuncios</h2>
            <button
              onClick={() => setShowNewAdForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Anuncio
            </button>
          </div>

          {showNewAdForm && (
            <form onSubmit={handleAdSubmit} className="mb-6 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Texto del Anuncio
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-md"
                    value={adFormData.text}
                    onChange={(e) => setAdFormData({...adFormData, text: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color de Fondo
                  </label>
                  <input
                    type="color"
                    required
                    className="w-full h-10"
                    value={adFormData.backgroundColor}
                    onChange={(e) => setAdFormData({...adFormData, backgroundColor: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color del Texto
                  </label>
                  <input
                    type="color"
                    required
                    className="w-full h-10"
                    value={adFormData.textColor}
                    onChange={(e) => setAdFormData({...adFormData, textColor: e.target.value})}
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={adFormData.isActive}
                      onChange={(e) => setAdFormData({...adFormData, isActive: e.target.checked})}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Activar Anuncio</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Guardar Anuncio
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewAdForm(false)}
                  className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

<div className="space-y-4">
  {advertisements.map((ad) => (
    <div 
      key={ad._id} 
      className="border rounded-lg"
    >
      {editingAd === ad._id ? (
        // Formulario de edición
        <form onSubmit={handleEditAdSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto del Anuncio
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded-md"
                value={editAdFormData.text}
                onChange={(e) => setEditAdFormData({...editAdFormData, text: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color de Fondo
              </label>
              <input
                type="color"
                required
                className="w-full h-10"
                value={editAdFormData.backgroundColor}
                onChange={(e) => setEditAdFormData({...editAdFormData, backgroundColor: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color del Texto
              </label>
              <input
                type="color"
                required
                className="w-full h-10"
                value={editAdFormData.textColor}
                onChange={(e) => setEditAdFormData({...editAdFormData, textColor: e.target.value})}
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editAdFormData.isActive}
                  onChange={(e) => setEditAdFormData({...editAdFormData, isActive: e.target.checked})}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Activar Anuncio</span>
              </label>
            </div>
          </div>

          {/* Preview del anuncio */}
          <div 
            className="p-3 rounded text-center"
            style={{
              backgroundColor: editAdFormData.backgroundColor,
              color: editAdFormData.textColor
            }}
          >
            <p className="font-medium">{editAdFormData.text || 'Vista previa del anuncio'}</p>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={cancelEditingAd}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      ) : (
        // Vista normal del anuncio
        <div 
          className="flex items-center justify-between p-4"
          style={{
            backgroundColor: ad.backgroundColor,
            color: ad.textColor
          }}
        >
          <div>
            <p className="font-medium">{ad.text}</p>
            <p className="text-sm opacity-75">
              {ad.isActive ? 'Activo' : 'Inactivo'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleAdUpdate(ad._id, !ad.isActive)}
              className={`px-3 py-1 rounded-md ${
                ad.isActive 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {ad.isActive ? 'Desactivar' : 'Activar'}
            </button>
            <button
              onClick={() => startEditingAd(ad)}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md"
            >
              Modificar
            </button>
            <button
              onClick={() => handleAdDelete(ad._id)}
              className="bg-red-100 text-red-800 px-3 py-1 rounded-md"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  ))}
</div>
        </div>

        {/* Formulario para nuevo producto */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Añadir Nuevo Producto</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  onChange={(e) => handleImageChange(e, 'new')}
                  required
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

            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin w-4 h-4" />
                  Añadiendo...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Añadir Producto
                </>
              )}
            </button>
          </form>
        </div>

        {/* Lista de productos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Productos Existentes</h2>
          <div className="space-y-6">
            {products.map((product) => (
              <div key={product._id} className="border rounded-lg p-4">
                {editingProduct === product._id ? (
                  // Formulario de edición
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre del Producto
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          value={editFormData.name}
                          onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoría
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md"
                          value={editFormData.category}
                          onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                      </label>
                      <textarea
                        className="w-full p-2 border rounded-md"
                        rows="4"
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nueva Imagen (opcional)
                      </label>
                      <input
                        type="file"
                        className="w-full"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'edit')}
                      />
                      <div className="mt-2 relative w-32 h-32">
                        <img
                          src={editFormData.previewUrl || product.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editFormData.featured}
                          onChange={(e) => setEditFormData({...editFormData, featured: e.target.checked})}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          Producto destacado
                        </span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleUpdate(product._id)}
                        disabled={loading}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  // Vista del producto
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
                      <p className="text-gray-700">{product.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(product)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;