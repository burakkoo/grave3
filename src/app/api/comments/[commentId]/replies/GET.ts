/**
 * GET /api/comments/:commentId/replies
 * - Returns the replies of a comment specified by the
 * :commentId parameter.
 */
import { getServerUser } from '@/lib/getServerUser';
import { includeToComment } from '@/lib/prisma/includeToComment';
import prisma from '@/lib/prisma/prisma';
import { toGetComment } from '@/lib/prisma/toGetComment';
import { NextResponse } from 'next/server';
import { FindCommentResult, GetComment } from '../../../../../types/definitions';

export async function GET(request: Request, { params }: { params: { commentId: string } }) {
  /**
   * The `userId` will only be used to check whether the user
   * requesting the comments has liked them or not.
   */
  const [user] = await getServerUser();
  const userId = user?.id;

  const res = await prisma.comment.findMany({
    where: {
      parentId: parseInt(params.commentId),
    },
    include: includeToComment(userId),
    orderBy: {
      id: 'asc',
    },
  }) as unknown as Parameters<typeof toGetComment>[0][];

  const replies: GetComment[] = [];
  for (const comment of res) replies.push(await toGetComment(comment));

  return NextResponse.json(replies);
}
