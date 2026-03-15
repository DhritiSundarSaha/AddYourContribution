import mongoose from 'mongoose';

const designSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prompt: String,
    source: { type: String, enum: ['upload', 'ai', 'asset'], required: true },
    canvasJson: Object,
    designUrl: String,
    printReadyUrl: String,
    mockupUrl: String
  },
  { timestamps: true }
);

export const Design = mongoose.model('Design', designSchema);
