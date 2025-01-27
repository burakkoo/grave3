import { DiscoverFilters } from '@/components/DiscoverFilters';
import { DiscoverProfiles } from '@/components/DiscoverProfiles';
import { DiscoverSearch } from '@/components/DiscoverSearch';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Memoria | Discover',
};

export default async function Discover() {
  // Redirect or show error since discover is disabled
  redirect('/');
  
  // Original code won't be reached
  return (
    <div className="px-4 pt-4">
      <h1 className="mb-4 text-4xl font-bold">Discover</h1>
      <DiscoverSearch />
      <DiscoverFilters />
      <DiscoverProfiles />
    </div>
  );
}
