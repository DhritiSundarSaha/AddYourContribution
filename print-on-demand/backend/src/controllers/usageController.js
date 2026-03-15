import { UsageLimit } from '../models/UsageLimit.js';

export async function getUsage(req, res) {
  const usage = await UsageLimit.findOne({ userId: req.user.userId });
  res.json(usage);
}
