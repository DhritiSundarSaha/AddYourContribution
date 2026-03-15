import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        size: String,
        color: String,
        quantity: Number,
        designId: { type: mongoose.Schema.Types.ObjectId, ref: 'Design' }
      }
    ],
    amount: Number,
    upiTransactionId: String,
    paymentStatus: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
    shippingAddress: {
      fullName: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      phone: String
    },
    orderAssets: [
      {
        designFile: String,
        mockupFile: String
      }
    ]
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
