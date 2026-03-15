import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pod-app',
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  openAiApiKey: process.env.OPENAI_API_KEY || '',
  r2Endpoint: process.env.R2_ENDPOINT || '',
  r2Region: process.env.R2_REGION || 'auto',
  r2AccessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  r2Bucket: process.env.R2_BUCKET || 'pod-assets'
};
