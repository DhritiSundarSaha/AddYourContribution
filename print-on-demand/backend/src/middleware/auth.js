import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const token = header.replace('Bearer ', '');
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
}
