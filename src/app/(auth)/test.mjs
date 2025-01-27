import { ListBucketsCommand, S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

const s3Client = new S3Client({
  endpoint: 'http://192.168.1.10:9000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'awusGWd1UtXUc1xCqwbd',
    secretAccessKey: 'JZ9t4GMZpKLwP09p2nKrCnIDd7UWLMlOOhSPnjDb',
  },
});

// Example usage
async function listBuckets() {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log('Successfully listed buckets:', data.Buckets);
  } catch (err) {
    console.error('Error listing buckets:', err);
  }
}

async function uploadFile(bucketName, objectKey, filePath) {
  const fileStream = fs.createReadStream(filePath);

  const uploadParams = {
    Bucket: bucketName,
    Key: objectKey,
    Body: fileStream,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log('Successfully uploaded file:', data);
  } catch (err) {
    console.error('Error uploading file:', err);
  }
}

// Example usage
const bucketName = 'memoria';
const objectKey = 'example.txt';
const filePath = './example.txt'; // Replace with the path to your local file

listBuckets();
uploadFile(bucketName, objectKey, filePath);
// Usage: uploadFile(bucketName, key, file);
