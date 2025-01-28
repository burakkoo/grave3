export const revalidate = 0; // Disable caching at the page level

// In your data fetching function
async function getProfileData(username: string) {
  const response = await fetch(`/api/profile/${username}`, {
    cache: 'no-store',
    next: { revalidate: 0 }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
}

// Add default export
export default async function ProfilePage({ params }: { params: { username: string } }) {
  const profile = await getProfileData(params.username);
  return <div>{/* Your page content */}</div>;
} 