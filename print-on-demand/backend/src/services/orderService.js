import { v4 as uuidv4 } from 'uuid';
import { uploadBuffer } from './storageService.js';

export async function generateOrderAssets({ orderId, designDataUrl, mockupDataUrl }) {
  const designBuffer = Buffer.from(designDataUrl || '', 'base64');
  const mockupBuffer = Buffer.from(mockupDataUrl || '', 'base64');

  const designFile = await uploadBuffer({
    key: `orders/${orderId}/print-${uuidv4()}.png`,
    contentType: 'image/png',
    body: designBuffer
  });

  const mockupFile = await uploadBuffer({
    key: `orders/${orderId}/mockup-${uuidv4()}.png`,
    contentType: 'image/png',
    body: mockupBuffer
  });

  return { designFile, mockupFile };
}
