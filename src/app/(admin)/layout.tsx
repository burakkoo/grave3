'use client';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

// Fetch function to check admin status
const fetchAdminStatus = async () => {
  const response = await fetch('/api/admin/check');
  if (!response.ok) {
    throw new Error('Failed to fetch admin status');
  }
  const data = await response.json();
  return data.isadmin;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // React Query to fetch admin status
  const {
    data: isAdmin,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['adminStatus'],
    queryFn: fetchAdminStatus,
    retry: false, // Disable retries
  });

  // Redirect on error or if the user is not admin
  React.useEffect(() => {
    if (isError || isAdmin === false) {
      router.push('/');
    }
  }, [isError, isAdmin, router]);

  // Show loading indicator while fetching admin status
  if (isLoading) {
    return <div>Loading...</div>; // Customize loading state
  }

  // Prevent rendering children if not admin
  if (isError || isAdmin === false) {
    return null;
  }

  // Render children if the user is an admin
  return <>{children}</>;
}
