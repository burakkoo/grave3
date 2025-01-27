import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { getServerUser } from '@/lib/getServerUser';
import { urlToFileName } from '@/lib/s3/urlToFileName';
import { deleteFromS3 } from '@/lib/s3/deleteFromS3';

export async function POST(request: Request) {
  try {
    const [user] = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { photoUrl } = await request.json();
    const fileName = urlToFileName(photoUrl);

    if (!fileName) {
      return NextResponse.json({ error: 'Invalid photo URL' }, { status: 400 });
    }

    // Find the visual media
    const visualMedia = await prisma.visualMedia.findFirst({
      where: { 
        fileName,
        userId: user.id
      }
    });

    if (!visualMedia) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    try {
      // Delete from S3
      await deleteFromS3(fileName);

      // Delete only this specific visual media
      await prisma.visualMedia.delete({
        where: { id: visualMedia.id }
      });

      return NextResponse.json({ success: true });
    } catch (s3Error) {
      console.error('Error deleting from S3:', s3Error);
      return NextResponse.json(
        { error: 'Failed to delete photo from storage' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
} 