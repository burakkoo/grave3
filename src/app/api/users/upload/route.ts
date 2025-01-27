import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@/lib/s3/s3Client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { file, fileName, contentType } = body;

    if (!file || !fileName || !contentType) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(file, 'base64'), // Decode base64 string
      ContentType: contentType,
    });

    await s3Client.send(command);

    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return NextResponse.json({ message: 'Error uploading file', error }, { status: 500 });
  }
}
