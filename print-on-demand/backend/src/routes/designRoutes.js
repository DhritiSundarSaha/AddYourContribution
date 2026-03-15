import { Router } from 'express';
import {
  attachAssetAsDesign,
  generateAiDesign,
  listAssets,
  saveCanvas,
  uploadDesign
} from '../controllers/designController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.get('/assets', listAssets);
router.post('/upload', auth, uploadDesign);
router.post('/ai-generate', auth, generateAiDesign);
router.post('/canvas/save', auth, saveCanvas);
router.post('/assets/:assetId/use', auth, attachAssetAsDesign);

export default router;
