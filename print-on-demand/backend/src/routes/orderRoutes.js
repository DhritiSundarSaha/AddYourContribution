import { Router } from 'express';
import {
  confirmUpiPayment,
  createOrder,
  listAllOrders,
  listMyOrders,
  orderDesignDetails
} from '../controllers/orderController.js';
import { adminOnly, auth } from '../middleware/auth.js';

const router = Router();
router.post('/', auth, createOrder);
router.post('/:orderId/confirm-upi', auth, confirmUpiPayment);
router.get('/me', auth, listMyOrders);
router.get('/admin', auth, adminOnly, listAllOrders);
router.get('/designs/details', auth, orderDesignDetails);

export default router;
