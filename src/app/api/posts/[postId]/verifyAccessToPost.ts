import { getServerUser } from '@/lib/getServerUser';
import prisma from '@/lib/prisma/prisma';

export async function verifyAccessToPost(postId: number) {
  const [user] = await getServerUser();
  if (!user) return false;

  // Get the post and check both the post owner and profile owner
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      userId: true,
      user: {
        select: {
          id: true
        }
      }
    }
  });

  if (!post) return false;

  // Allow access if user is the post owner
  return user.id === post.user.id;
}
