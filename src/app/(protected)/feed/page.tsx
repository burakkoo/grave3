import { CreatePostModalLauncher } from '@/components/CreatePostModalLauncher';
import { Posts } from '@/components/Posts';
import { ThemeSwitch } from '@/components/ui/ThemeSwitch';
import { getServerUser } from '@/lib/getServerUser';

export const metadata = {
  title: 'Memoria | Feed',
};

export default async function Page() {
  const [user] = await getServerUser();
  return (
    <div className="container mx-auto px-2 pt-4 sm:px-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Feed</h1>
        <div>
          <ThemeSwitch />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        {user && <Posts type="feed" userId={user.id} />}
      </div>
    </div>
  );
}
