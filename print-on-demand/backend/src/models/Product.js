import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ['Men', 'Women', 'Unisex'], required: true },
    designCategory: {
      type: String,
      enum: ['Anime', 'Bollywood', 'Hollywood', 'Gaming', 'Sports', 'Mandala', 'Minimal', 'Line art']
    },
    type: { type: String, enum: ['T-shirt', 'Hoodie', 'Cap', 'Mug', 'Sports T-shirt'], required: true },
    sizes: [String],
    colors: [String],
    basePrice: Number,
    mockupImage: String
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
