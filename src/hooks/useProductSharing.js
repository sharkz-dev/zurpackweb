import { useCallback } from 'react';

export const useProductSharing = () => {
  const shareProduct = useCallback(async (product) => {
    const shareData = {
      title: product.name,
      text: product.description,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(text);
        alert('Enlace copiado al portapapeles');
      }
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  }, []);

  return shareProduct;
};