import { Router } from 'express';
import { generateInvoice } from '../controllers/invoiceController.js';
import { ordersByStatus } from '../controllers/analyticsController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Admin-only analytics
router.get('/orders/analytics', protect, adminOnly, ordersByStatus);

// Invoice generation (protected)
router.get('/orders/:id/invoice',  generateInvoice);

export default router;
