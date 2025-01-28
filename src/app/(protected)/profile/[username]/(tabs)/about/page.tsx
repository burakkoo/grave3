import { getProfile } from '../../getProfile';
import { About } from './About';
import { userKeys } from '@/lib/cache/userCache';

export const revalidate = 30; // revalidate at most every 30 seconds

export async function generateMetadata({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);
  return {
    title: `About | ${profile?.name}` || 'About',
    other: {
      'x-revalidate-tag': `user-${profile?.id}`
    }
  };
}

export default async function Page({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);
  if (!profile) return null;

  return (
    <div className="mt-4">
      <About profile={profile} />
    </div>
  );
}
