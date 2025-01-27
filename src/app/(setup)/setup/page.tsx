import { EditProfileForm } from '@/components/EditProfileForm';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';

export const metadata = {
  title: 'Memoria | Setup Profile',
};

export default function Page() {
  return (
    <ResponsiveContainer className="mx-auto my-4 px-4 md:w-[600px] md:px-0 lg:w-[600px]">
      <h1 className="mb-1 text-3xl font-bold">Welcome to Memoria!</h1>
      <p className="mb-4 text-muted-foreground">
        Please setup your profile to proceed, only the <b>name</b> and <b>username</b> fields are required.
      </p>
      <EditProfileForm />
    </ResponsiveContainer>
  );
}
