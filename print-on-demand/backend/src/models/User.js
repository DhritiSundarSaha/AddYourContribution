import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    disclaimerAccepted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
