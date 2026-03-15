import { Design } from '../models/Design.js';
import { Order } from '../models/Order.js';
import { UsageLimit } from '../models/UsageLimit.js';
import { generateOrderAssets } from '../services/orderService.js';

export async function createOrder(req, res) {
  const order = await Order.create({ ...req.body, userId: req.user.userId, paymentStatus: 'pending' });
  res.status(201).json(order);
}

export async function confirmUpiPayment(req, res) {
  const { orderId } = req.params;
  const { upiTransactionId, designDataUrl, mockupDataUrl } = req.body;

  const order = await Order.findOne({ _id: orderId, userId: req.user.userId });
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const { designFile, mockupFile } = await generateOrderAssets({
    orderId: order._id.toString(),
    designDataUrl,
    mockupDataUrl
  });

  order.paymentStatus = 'confirmed';
  order.upiTransactionId = upiTransactionId;
  order.orderAssets.push({ designFile, mockupFile });
  await order.save();

  await UsageLimit.findOneAndUpdate(
    { userId: req.user.userId },
    { $set: { tier: 'buyer' }, $inc: { aiGenerationsRemaining: 30, mockupsRemaining: 100 } }
  );

  res.json(order);
}

export async function listMyOrders(req, res) {
  const orders = await Order.find({ userId: req.user.userId }).populate('items.productId').sort({ createdAt: -1 });
  res.json(orders);
}

export async function listAllOrders(req, res) {
  const orders = await Order.find().populate('items.productId').populate('userId', 'name email').sort({ createdAt: -1 });
  res.json(orders);
}

export async function orderDesignDetails(req, res) {
  const ids = req.query.designIds?.split(',') || [];
  const designs = await Design.find({ _id: { $in: ids } });
  res.json(designs);
}
