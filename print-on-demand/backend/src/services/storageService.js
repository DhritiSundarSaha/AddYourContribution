import { PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env.js';
import { storageClient } from '../config/storage.js';

export async function uploadBuffer({ key, contentType, body }) {
  await storageClient.send(
    new PutObjectCommand({
      Bucket: env.r2Bucket,
      Key: key,
      Body: body,
      ContentType: contentType
    })
  );

  return `${env.r2Endpoint}/${env.r2Bucket}/${key}`;
}
