/**
 * DELETE /api/comments/:commentId
 * - Allows an authenticated user to delete a comment on a post.
 */

import prisma from '@/lib/prisma/prisma';
import { NextResponse } from 'next/server';
import { getServerUser } from '@/lib/getServerUser';
import { verifyAccessToComment } from './verifyAccessToComment';

export async function DELETE(request: Request, { params }: { params: { commentId: string } }) {
  const [user] = await getServerUser();
  const commentId = parseInt(params.commentId);
  if (!verifyAccessToComment(commentId)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const res = await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  // Delete the associated 'CREATE_REPLY' or 'CREATE_COMMENT' activity logs
  // If `isComment` is false, it is a reply
  const type = res?.parentId ? 'CREATE_REPLY' : 'CREATE_COMMENT';

  // Add type casting to ensure targetId is a number
  const targetId = (() => {
    if (type === 'CREATE_COMMENT') {
      return typeof res.postId === 'string' ? parseInt(res.postId, 10) : res.postId;
    }
    return res.parentId ? 
      (typeof res.parentId === 'string' ? parseInt(res.parentId, 10) : res.parentId) : 
      null;
  })();

  await prisma.activity.delete({
    where: {
      type,
      sourceUserId: user?.id,
      sourceId: res.id,
      targetId,
    },
  });

  return NextResponse.json({ id: res.id });
}
