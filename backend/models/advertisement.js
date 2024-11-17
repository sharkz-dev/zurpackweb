import mongoose from 'mongoose';

const advertisementSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  backgroundColor: {
    type: String,
    required: true,
    default: '#000000'
  },
  textColor: {
    type: String,
    required: true,
    default: '#FFFFFF'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Advertisement', advertisementSchema);