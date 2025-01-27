/**
 * GET /api/users/:userId/posts
 * - Returns the approved posts composed by a single user
 */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma/prisma';
import { selectPost } from '@/lib/prisma/selectPost';
import { GetPost } from '@/types/definitions';
import { toGetPost } from '@/lib/prisma/toGetPost';
import { getServerUser } from '@/lib/getServerUser';
import { usePostsSorter } from '@/hooks/usePostsSorter';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const [user] = await getServerUser();
  const { filters, limitAndOrderBy } = usePostsSorter(request.url);

  const res = await prisma.post.findMany({
    where: {
      userId: params.userId,
      // Only show approved posts in the timeline
      ApprovalStatus: true,
      ...filters,
    },
    ...limitAndOrderBy,
    select: selectPost(user?.id),
  });

  const posts: GetPost[] = [];
  for (const post of res) posts.push(await toGetPost(post));
  return NextResponse.json<GetPost[] | null>(posts);
}
