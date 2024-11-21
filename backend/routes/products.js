import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';
import dotenv from 'dotenv';
import { protect } from '../middleware/authMiddleware.js';

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Función para obtener el public_id de una URL de Cloudinary
const getPublicIdFromUrl = (url) => {
  try {
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1];
    const folderName = urlParts[urlParts.length - 2];
    return `${folderName}/${filename.split('.')[0]}`;
  } catch (error) {
    console.error('Error extrayendo public_id:', error);
    return null;
  }
};

// Obtener todos los productos (ruta pública)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: error.message });
  }
});

// Obtener un producto por slug (ruta pública)
router.get('/by-slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ message: error.message });
  }
});

// Mantener la ruta por ID para compatibilidad
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    // Logging detallado
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('SizeVariants antes de parsear:', req.body.sizeVariants);

    if (!req.file) {
      return res.status(400).json({ 
        message: 'No se ha proporcionado una imagen',
        details: 'El campo image es requerido'
      });
    }

    // Validar datos requeridos
    if (!req.body.name) {
      return res.status(400).json({ 
        message: 'El nombre es requerido',
        field: 'name'
      });
    }

    if (!req.body.description) {
      return res.status(400).json({ 
        message: 'La descripción es requerida',
        field: 'description'
      });
    }

    if (!req.body.category) {
      return res.status(400).json({ 
        message: 'La categoría es requerida',
        field: 'category'
      });
    }

    let sizeVariants = [];
    if (req.body.sizeVariants) {
      try {
        sizeVariants = JSON.parse(req.body.sizeVariants);
        console.log('SizeVariants parseados:', sizeVariants);
      } catch (error) {
        console.error('Error parseando sizeVariants:', error);
        return res.status(400).json({ 
          message: 'Error en el formato de sizeVariants',
          details: error.message
        });
      }
    }

    // Subir imagen a Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
      folder: 'productos'
    });

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      imageUrl: uploadResponse.secure_url,
      featured: req.body.featured === 'true',
      hasSizeVariants: true,
      sizeVariants: sizeVariants
    });

    console.log('Producto a guardar:', product);

    const savedProduct = await product.save();
    console.log('Producto guardado exitosamente:', savedProduct);
    
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(400).json({ 
      message: error.message,
      details: error.errors ? Object.values(error.errors).map(e => e.message) : [],
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Actualizar producto (protegida)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      featured: req.body.featured === 'true',
      hasSizeVariants: req.body.hasSizeVariants === 'true',
      sizeVariants: req.body.sizeVariants ? JSON.parse(req.body.sizeVariants) : []
    };

    if (req.file) {
      const currentProduct = await Product.findById(req.params.id);
      if (currentProduct && currentProduct.imageUrl) {
        const publicId = getPublicIdFromUrl(currentProduct.imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        resource_type: 'auto',
        folder: 'productos'
      });
      updateData.imageUrl = uploadResponse.secure_url;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(400).json({ message: error.message });
  }
});

// Eliminar producto (protegida)
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const publicId = getPublicIdFromUrl(product.imageUrl);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error('Error eliminando imagen de Cloudinary:', cloudinaryError);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error en la eliminación:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;