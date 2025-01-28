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
        type: {
          in: ['PHOTO', 'VIDEO']  // Include both photos and videos
        },
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
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}
