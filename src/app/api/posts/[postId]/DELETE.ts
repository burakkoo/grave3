/**
 * DELETE /api/posts/:postId
 * - Allows an authenticated user to delete a post.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { deleteObject } from '@/lib/s3/deleteObject';
import { verifyAccessToPost } from './verifyAccessToPost';

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const postId = params.postId; // Keep as string since Post.id is String type
  
  // Verify access first
  const hasAccess = await verifyAccessToPost(postId);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Unauthorized to delete this post' }, { status: 403 });
  }

  try {
    // Delete the post and associated media
    const res = await prisma.post.delete({
      include: {
        visualMedia: true,
      },
      where: {
        id: postId, // Use string ID
      },
    });

    // Delete associated media files from S3
    for (const { fileName } of res.visualMedia) {
      await deleteObject(fileName);
    }

    return NextResponse.json({ id: res.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
