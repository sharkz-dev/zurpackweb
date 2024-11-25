import React, { useState, useEffect, memo } from 'react';
import { Loader } from 'lucide-react';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { useAdminAdvertisements } from '../hooks/useAdminAdvertisements';
import ProductTable from '../components/admin/ProductTable';
import ProductForm from '../components/admin/ProductForm';
import AdvertisementManager from '../components/admin/AdvertisementManager';
import Toast from '../components/Toast';

// Componente para mensajes de estado
const StatusMessage = memo(({ type, message }) => (
  <div className={`p-4 mb-6 rounded-lg ${
    type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
  }`}>
    {message}
  </div>
));

// Componente de sección con título
const Section = memo(({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
    <h2 className="text-xl font-semibold mb-4 sm:mb-6">{title}</h2>
    {children}
  </div>
));

// Tabs para navegación
const Tabs = memo(({ activeTab, onTabChange }) => (
  <div className="flex flex-wrap gap-2 mb-6">
    <button
      onClick={() => onTabChange('products')}
      className={`px-4 py-2 rounded-lg transition-colors ${
        activeTab === 'products'
          ? 'bg-green-500 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      Productos
    </button>
    <button
      onClick={() => onTabChange('advertisements')}
      className={`px-4 py-2 rounded-lg transition-colors ${
        activeTab === 'advertisements'
          ? 'bg-green-500 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      Anuncios
    </button>
  </div>
));

const Admin = () => {
  const {
    products,
    loading: productsLoading,
    error: productsError,
    imagePreview,
    fetchProducts,
    handleImageChange,
    createProduct,
    updateProduct,
    deleteProduct,
    setImagePreview
  } = useAdminProducts();

  const {
    advertisements,
    loading: adsLoading,
    error: adsError,
    fetchAdvertisements,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    toggleAdvertisement
  } = useAdminAdvertisements();

  // Estados locales
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    image: null,
    featured: false,
    hasSizeVariants: false,
    sizeVariants: []
  });

  // Efectos
  useEffect(() => {
    fetchProducts();
    fetchAdvertisements();
  }, [fetchProducts, fetchAdvertisements]);

  // Helpers
  const showMessage = (message, type = 'success') => {
    setStatusMessage({ message, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      image: null,
      featured: false,
      hasSizeVariants: false,
      sizeVariants: []
    });
    setImagePreview(null);
    setEditingProduct(null);
  };

  // Handlers
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const productFormData = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'sizeVariants') {
        productFormData.append(key, JSON.stringify(formData[key]));
      } else if (key !== 'image' || formData[key]) {
        productFormData.append(key, formData[key]);
      }
    });

    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, productFormData);
        showMessage('Producto actualizado correctamente');
      } else {
        await createProduct(productFormData);
        showMessage('Producto creado correctamente');
      }
      resetForm();
    } catch (error) {
      showMessage(error.message, 'error');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      featured: product.featured,
      hasSizeVariants: product.hasSizeVariants || false,
      sizeVariants: product.sizeVariants || [],
      image: null
    });
    setImagePreview(product.imageUrl);
  };

  const loading = productsLoading || adsLoading;
  const error = productsError || adsError;

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <div className="flex items-center space-x-4">
          <Loader className="w-8 h-8 text-green-500 animate-spin" />
          <span className="text-lg sm:text-xl text-gray-700">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Panel de Administración
        </h1>

        {statusMessage && (
          <StatusMessage type={statusMessage.type} message={statusMessage.message} />
        )}

        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'products' ? (
          <>
            <Section title={editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}>
            <ProductForm
  formData={formData}
  setFormData={setFormData}
  imagePreview={imagePreview}
  onSubmit={handleProductSubmit}
  onCancel={editingProduct ? resetForm : undefined}
  isEditing={!!editingProduct}
  products={products} // Añade esta prop
  onImageChange={(e) => {
    const file = handleImageChange(e.target.files[0]);
    setFormData(prev => ({ ...prev, image: file }));
  }}
/>
            </Section>

            <Section title="Productos Existentes">
              <div className="overflow-x-auto">
                <ProductTable
                  products={products}
                  onEdit={handleEditProduct}
                  onDelete={async (id) => {
                    if (await deleteProduct(id)) {
                      showMessage('Producto eliminado correctamente');
                    }
                  }}
                />
              </div>
            </Section>
          </>
        ) : (
          <Section title="Gestión de Anuncios">
            <AdvertisementManager
              advertisements={advertisements}
              onCreateAd={async (data) => {
                if (await createAdvertisement(data)) {
                  showMessage('Anuncio creado correctamente');
                }
              }}
              onUpdateAd={async (id, data) => {
                if (await updateAdvertisement(id, data)) {
                  showMessage('Anuncio actualizado correctamente');
                }
              }}
              onDeleteAd={async (id) => {
                if (await deleteAdvertisement(id)) {
                  showMessage('Anuncio eliminado correctamente');
                }
              }}
              onToggleActive={async (id, isActive) => {
                if (await toggleAdvertisement(id, isActive)) {
                  showMessage(`Anuncio ${isActive ? 'activado' : 'desactivado'} correctamente`);
                }
              }}
            />
          </Section>
        )}
      </div>
    </div>
  );
};

export default memo(Admin);