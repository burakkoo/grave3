import { Posts } from '@/components/Posts';
import { CreatePostModalLauncher } from '@/components/CreatePostModalLauncher';
import { getServerUser } from '@/lib/getServerUser';
import { getProfile } from '../getProfile';
import { set } from 'lodash';
import { config } from '@/lib/config';

export async function generateMetadata({ params }: { params: { username: string } }) {
  const profile = await getProfile(params.username);
  return {
    title: profile?.name || 'Memoria',
  };
}

export default async function Page({ params }: { params: { username: string } }) {
  const [user] = await getServerUser();
  const profile = await getProfile(params.username);

  console.log('profile', params.username);
  // const shouldShowCreatePost = user?.id === profile?.id;
  const shouldShowCreatePost = true;

  return (
    <div>
      {shouldShowCreatePost && (
        <div className="mt-4">
          <CreatePostModalLauncher profileId={profile?.id!} userId={user?.id!} />
        </div>
      )}
      {profile && <Posts type="profile" userId={profile.id} />}
    </div>
  );
}
