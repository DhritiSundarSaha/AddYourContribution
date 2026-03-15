import { S3Client } from '@aws-sdk/client-s3';
import { env } from './env.js';

export const storageClient = new S3Client({
  region: env.r2Region,
  endpoint: env.r2Endpoint || undefined,
  forcePathStyle: Boolean(env.r2Endpoint),
  credentials: env.r2AccessKeyId
    ? {
        accessKeyId: env.r2AccessKeyId,
        secretAccessKey: env.r2SecretAccessKey
      }
    : undefined
});
