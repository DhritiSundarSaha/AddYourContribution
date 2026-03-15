import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tags: [String],
    category: {
      type: String,
      enum: ['Anime', 'Bollywood', 'Hollywood', 'Gaming', 'Sports', 'Mandala', 'Minimal', 'Line art'],
      required: true
    },
    fileUrl: { type: String, required: true },
    format: { type: String, enum: ['png', 'jpg', 'jpeg'], required: true }
  },
  { timestamps: true }
);

export const Asset = mongoose.model('Asset', assetSchema);
