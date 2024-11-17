import Advertisement from '../models/advertisement.js';

// Obtener anuncio activo
export const getActiveAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findOne({ isActive: true });
    res.json(advertisement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear anuncio
export const createAdvertisement = async (req, res) => {
  try {
    const { text, backgroundColor, textColor, isActive } = req.body;
    
    // Si hay un anuncio activo y este nuevo anuncio será activo, desactivar el actual
    if (isActive) {
      await Advertisement.updateMany({}, { isActive: false });
    }
    
    const advertisement = new Advertisement({
      text,
      backgroundColor,
      textColor,
      isActive
    });

    const createdAdvertisement = await advertisement.save();
    res.status(201).json(createdAdvertisement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los anuncios
export const getAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find({}).sort({ createdAt: -1 });
    res.json(advertisements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar anuncio
export const updateAdvertisement = async (req, res) => {
  try {
    const { text, backgroundColor, textColor, isActive } = req.body;
    
    // Si este anuncio será activo, desactivar todos los demás
    if (isActive) {
      await Advertisement.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
    }
    
    const advertisement = await Advertisement.findById(req.params.id);
    
    if (advertisement) {
      advertisement.text = text || advertisement.text;
      advertisement.backgroundColor = backgroundColor || advertisement.backgroundColor;
      advertisement.textColor = textColor || advertisement.textColor;
      advertisement.isActive = isActive;

      const updatedAdvertisement = await advertisement.save();
      res.json(updatedAdvertisement);
    } else {
      res.status(404).json({ message: 'Anuncio no encontrado' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar anuncio
// Eliminar anuncio
export const deleteAdvertisement = async (req, res) => {
  try {
    const advertisement = await Advertisement.findById(req.params.id);
    
    if (!advertisement) {
      return res.status(404).json({ message: 'Anuncio no encontrado' });
    }

    await Advertisement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Anuncio eliminado correctamente' });
    
  } catch (error) {
    console.error('Error al eliminar anuncio:', error);
    res.status(500).json({ message: 'Error al eliminar el anuncio' });
  }
};