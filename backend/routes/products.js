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
    return `${folderName}/${filename.split('.')[0]}`; // productos/abcdef123456
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

// Obtener un producto específico por ID (ruta pública)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ message: error.message });
  }
});

// Crear nuevo producto (protegida)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha proporcionado una imagen' });
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
      hasSizeVariants: req.body.hasSizeVariants === 'true',
      sizeVariants: req.body.hasSizeVariants === 'true' ? 
        JSON.parse(req.body.sizeVariants) : []
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(400).json({ message: error.message });
  }
});

// Actualizar producto (protegida)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    // Parsear los datos del cuerpo de la petición
    const updateData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      featured: req.body.featured === 'true',
      hasSizeVariants: req.body.hasSizeVariants === 'true',
      sizeVariants: req.body.sizeVariants ? JSON.parse(req.body.sizeVariants) : []
    };

    // Manejar la actualización de la imagen si se proporciona una nueva
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

    // Actualizar el producto con todos los campos
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

    // Eliminar imagen de Cloudinary
    const publicId = getPublicIdFromUrl(product.imageUrl);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log('Imagen eliminada de Cloudinary');
      } catch (cloudinaryError) {
        console.error('Error eliminando imagen de Cloudinary:', cloudinaryError);
      }
    }

    // Eliminar producto de la base de datos
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: 'Producto e imagen eliminados correctamente',
      deletedProduct: product
    });
  } catch (error) {
    console.error('Error en la eliminación:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;