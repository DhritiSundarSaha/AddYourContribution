import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { UsageLimit } from '../models/UsageLimit.js';
import { env } from '../config/env.js';

export async function register(req, res) {
  const { name, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  await UsageLimit.create({ userId: user._id });
  res.status(201).json({ message: 'Registered' });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id, role: user.role }, env.jwtSecret, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
}
