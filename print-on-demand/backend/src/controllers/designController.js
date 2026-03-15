import { v4 as uuidv4 } from 'uuid';
import { Asset } from '../models/Asset.js';
import { Design } from '../models/Design.js';
import { UsageLimit } from '../models/UsageLimit.js';
import { generateImageFromPrompt } from '../services/aiService.js';
import { uploadBuffer } from '../services/storageService.js';
import { dataUrlToBase64 } from '../utils/dataUrl.js';

export async function uploadDesign(req, res) {
  const { dataUrl } = req.body;
  const base64 = dataUrlToBase64(dataUrl);
  const url = await uploadBuffer({
    key: `designs/${req.user.userId}/upload-${uuidv4()}.png`,
    contentType: 'image/png',
    body: Buffer.from(base64, 'base64')
  });

  const design = await Design.create({ userId: req.user.userId, source: 'upload', designUrl: url });
  res.status(201).json(design);
}

export async function generateAiDesign(req, res) {
  const usage = await UsageLimit.findOne({ userId: req.user.userId });
  if (!usage || usage.aiGenerationsRemaining <= 0) {
    return res.status(403).json({ message: 'AI generation limit reached' });
  }

  const { prompt } = req.body;
  const { imageBase64, warning } = await generateImageFromPrompt(prompt);

  let designUrl = '';
  if (imageBase64) {
    designUrl = await uploadBuffer({
      key: `designs/${req.user.userId}/ai-${uuidv4()}.png`,
      contentType: 'image/png',
      body: Buffer.from(imageBase64, 'base64')
    });
  }

  usage.aiGenerationsRemaining -= 1;
  await usage.save();

  const design = await Design.create({ userId: req.user.userId, source: 'ai', prompt, designUrl });
  res.status(201).json({ design, warning });
}

export async function saveCanvas(req, res) {
  const { designId, canvasJson, mockupDataUrl } = req.body;
  const design = await Design.findOne({ _id: designId, userId: req.user.userId });
  if (!design) return res.status(404).json({ message: 'Design not found' });

  const usage = await UsageLimit.findOne({ userId: req.user.userId });
  if (!usage || usage.mockupsRemaining <= 0) {
    return res.status(403).json({ message: 'Mockup limit reached' });
  }

  let mockupUrl = design.mockupUrl;
  if (mockupDataUrl) {
    mockupUrl = await uploadBuffer({
      key: `mockups/${req.user.userId}/mockup-${uuidv4()}.png`,
      contentType: 'image/png',
      body: Buffer.from(dataUrlToBase64(mockupDataUrl), 'base64')
    });
    usage.mockupsRemaining -= 1;
    await usage.save();
  }

  design.canvasJson = canvasJson;
  design.mockupUrl = mockupUrl;
  await design.save();

  res.json(design);
}

export async function listAssets(req, res) {
  const assets = await Asset.find(req.query.category ? { category: req.query.category } : {}).sort({ createdAt: -1 });
  res.json(assets);
}

export async function attachAssetAsDesign(req, res) {
  const asset = await Asset.findById(req.params.assetId);
  if (!asset) return res.status(404).json({ message: 'Asset not found' });

  const design = await Design.create({
    userId: req.user.userId,
    source: 'asset',
    designUrl: asset.fileUrl
  });

  res.status(201).json(design);
}
