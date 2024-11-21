import mongoose from 'mongoose';

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
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;