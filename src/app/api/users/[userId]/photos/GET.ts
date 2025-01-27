/**
 * GET /api/users/:userId/photos
 * - Returns the visual media URLs of the specified user.
 */

import prisma from '@/lib/prisma/prisma';
import { fileNameToUrl } from '@/lib/s3/fileNameToUrl';
import { NextResponse } from 'next/server';
import { GetVisualMedia } from '@/types/definitions';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const visualMedia = await prisma.visualMedia.findMany({
      where: {
        userId: params.userId,
        type: 'PHOTO',
        post: {
          ApprovalStatus: true
        }
      },
      include: {
        post: true
      },
      orderBy: {
        id: 'desc',
      },
      distinct: ['fileName'],
    });

    const transformedMedia = visualMedia.map(item => ({
      type: item.type,
      url: fileNameToUrl(item.fileName)!,
      caption: item.post.content
    })) as GetVisualMedia[];

    return NextResponse.json(transformedMedia);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}
