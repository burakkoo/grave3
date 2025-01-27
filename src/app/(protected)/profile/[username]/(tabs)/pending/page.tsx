import { getServerUser } from '@/lib/getServerUser';
import { getProfile } from '../../getProfile';
import { PendingContent } from './PendingContent';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);
  return {
    title: `Pending | ${profile?.name}` || 'Memoria',
  };
}

export default async function Page({ params }: { params: { username: string } }) {
  const [user] = await getServerUser();
  const profile = await getProfile(params.username);

  if (!profile) return null;

  return <PendingContent userId={profile.id} />;
}
