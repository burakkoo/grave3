import { QueryClient } from '@tanstack/react-query';
import { revalidateTag } from 'next/cache';

export const USER_CACHE_TIME = 5 * 60 * 1000; // 5 minutes
export const USER_STALE_TIME = 30 * 1000; // 30 seconds

// Cache keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (userId: string) => [...userKeys.details(), userId] as const,
  profile: (userId: string) => [...userKeys.detail(userId), 'profile'] as const,
  photos: (userId: string) => [...userKeys.detail(userId), 'photos'] as const,
};

export const invalidateUserCache = async (
  queryClient: QueryClient,
  userId: string
) => {
  // Invalidate React Query cache
  await queryClient.invalidateQueries({
    queryKey: userKeys.detail(userId),
  });

  // Invalidate specific user data
  await queryClient.invalidateQueries({
    queryKey: userKeys.photos(userId),
  });

  // Invalidate Next.js cache
  revalidateTag(`user-${userId}`);
}; 