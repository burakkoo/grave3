import { EditProfileForm } from '@/components/EditProfileForm';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

export const metadata = {
  title: 'Memoria | Edit Profile',
};

export default function Page() {
  return (
    <ResponsiveContainer className="mx-auto mb-4 px-4 md:w-[600px] md:px-0 lg:w-[600px]">
      <h1 className="my-4 text-3xl font-bold">Edit Profile</h1>
      <EditProfileForm />
    </ResponsiveContainer>
  );
}
