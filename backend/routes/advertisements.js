import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
  createAdvertisement,
  getAdvertisements,
  updateAdvertisement,
  deleteAdvertisement,
  getActiveAdvertisement
} from '../controllers/advertisementController.js';

const router = express.Router();

router.post('/', protect, admin, createAdvertisement);
router.get('/', protect, admin, getAdvertisements);
router.get('/active', getActiveAdvertisement);
router.put('/:id', protect, admin, updateAdvertisement);
router.delete('/:id', protect, admin, deleteAdvertisement);

export default router;