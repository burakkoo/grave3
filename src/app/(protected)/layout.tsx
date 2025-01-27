import { MenuBar } from '@/components/MenuBar';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { useCheckIfRequiredFieldsArePopulated } from '@/hooks/useCheckIfRequiredFieldsArePopulated';

export default async function Layout({ children }: { children: React.ReactNode }) {
  // This runs only once on the initial load of this layout
  // e.g. when the user signs in/up or on hard reload
  await useCheckIfRequiredFieldsArePopulated();

  return (
    <div className="md:flex md:justify-center md:gap-2">
      <MenuBar />

      <ResponsiveContainer className="pb-20 md:mx-auto md:pb-4 lg:mx-auto max-w-2xl">{children}</ResponsiveContainer>
    </div>
  );
}
