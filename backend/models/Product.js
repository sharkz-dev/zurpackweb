import mongoose from 'mongoose';

// Función para generar slug
function generateSlug(name) {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')     // Reemplazar espacios y guiones bajos con guiones
    .replace(/[^\w\-]+/g, '')    // Remover caracteres no permitidos
    .replace(/\-\-+/g, '-')      // Reemplazar múltiples guiones con uno solo
    .replace(/^-+/, '')          // Trim guiones del inicio
    .replace(/-+$/, '');         // Trim guiones del final
}

const sizeVariantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  hasSizeVariants: {
    type: Boolean,
    default: true,
    required: true
  },
  sizeVariants: {
    type: [sizeVariantSchema],
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 1;
      },
      message: 'El producto debe tener al menos un tamaño'
    }
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Middleware pre-save para generar el slug
productSchema.pre('save', async function(next) {
  if (!this.slug || this.isModified('name')) {
    let baseSlug = generateSlug(this.name);
    let slug = baseSlug;
    let counter = 1;
    
    // Verificar si el slug ya existe
    while (await mongoose.model('Product').findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = slug;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;