import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

if (!process.env.AWS_REGION || 
    !process.env.S3_ACCESS_KEY_ID || 
    !process.env.S3_SECRET_ACCESS_KEY || 
    !process.env.S3_BUCKET_NAME) {
  throw new Error('Missing required S3 environment variables');
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

export async function deleteFromS3(fileName: string): Promise<void> {
  if (!process.env.S3_BUCKET_NAME) {
    throw new Error('S3_BUCKET_NAME is not defined');
  }

  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
  });

  await s3Client.send(command);
} 