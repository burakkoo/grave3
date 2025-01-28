import { GetComment } from '@/types/definitions';

export async function getComments({ postId }: { postId: number }): Promise<GetComment[]> {
  const res = await fetch(`/api/posts/${postId}/comments`);
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch comments');
  }
  
  const data = await res.json();
  return data as GetComment[];
}
