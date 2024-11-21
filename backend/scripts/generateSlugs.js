import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

function generateSlug(name) {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

const migrateProducts = async () => {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado exitosamente');

    const products = await Product.find({});
    console.log(`Encontrados ${products.length} productos para actualizar`);
    
    for (const product of products) {
      if (!product.slug) {
        let baseSlug = generateSlug(product.name);
        let slug = baseSlug;
        let counter = 1;
        
        // Manejar slugs duplicados
        while (await Product.findOne({ slug, _id: { $ne: product._id } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        
        product.slug = slug;
        await product.save();
        console.log(`✓ Actualizado: ${product.name} -> ${slug}`);
      } else {
        console.log(`• Saltando: ${product.name} (ya tiene slug)`);
      }
    }

    console.log('\nMigración completada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
};

console.log('Iniciando migración de slugs...');
migrateProducts();