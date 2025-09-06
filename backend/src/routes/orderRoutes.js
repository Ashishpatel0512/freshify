import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { createOrder, myOrders, listOrders, updateStatus } from '../controllers/orderController.js';

const router = Router();

router.post('/', protect, createOrder);
router.get('/my', protect, myOrders);

// Admin
router.get('/', protect, adminOnly, listOrders);
router.put('/:id/status', protect, adminOnly, updateStatus);

export default router;
