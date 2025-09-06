import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { protect, adminOnly } from '../middleware/auth.js';
import { listVegetables, getVegetable, createVegetable, updateVegetable, removeVegetable } from '../controllers/vegetableController.js';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});
const upload = multer({ storage });

router.get('/', listVegetables);
router.get('/:id', getVegetable);
router.post('/', protect, adminOnly, upload.single('image'), createVegetable);
router.put('/:id', protect, adminOnly, upload.single('image'), updateVegetable);
router.delete('/:id', protect, adminOnly, removeVegetable);

export default router;
