import { Router } from 'express';
import { createProduct, listProducts } from '../controllers/productController.js';
import { adminOnly, auth } from '../middleware/auth.js';

const router = Router();
router.get('/', listProducts);
router.post('/', auth, adminOnly, createProduct);

export default router;
