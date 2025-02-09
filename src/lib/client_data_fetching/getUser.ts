import { GetUser } from '@/types/definitions';

export async function getUser(userId?: string) {
  const res = await fetch(`/api/users/${userId}`);

  console.log('userId', userId);
  console.log('res', res);

  if (!res) throw new Error("Error getting logged in user's data.");
  return (await res.json()) as GetUser;
}
