import mongoose from 'mongoose';

const usageLimitSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    aiGenerationsRemaining: { type: Number, default: 5 },
    mockupsRemaining: { type: Number, default: 10 },
    tier: { type: String, enum: ['free', 'buyer'], default: 'free' }
  },
  { timestamps: true }
);

export const UsageLimit = mongoose.model('UsageLimit', usageLimitSchema);
