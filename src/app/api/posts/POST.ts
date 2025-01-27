/**
 * POST /api/posts
 * - Allows any user (authenticated or not) to create a post.
 */
import { serverWritePost } from '@/hooks/serverWritePost';

export async function POST(request: Request) {
  const formData = await request.formData();
  return serverWritePost({ formData, type: 'create' });
}
