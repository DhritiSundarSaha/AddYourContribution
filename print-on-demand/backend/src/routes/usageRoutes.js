import { Router } from 'express';
import { getUsage } from '../controllers/usageController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.get('/me', auth, getUsage);

export default router;
