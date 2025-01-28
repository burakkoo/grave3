'use client';

import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { useDialogs } from './useDialogs';
import { useToast } from './useToast';
import { invalidateUserCache } from '@/lib/cache/userCache';
import { useQueryClient } from '@tanstack/react-query';

export function useUpdateProfileAndCoverPhotoClient(type: 'profile' | 'cover') {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { alert } = useDialogs();
  const { showToast } = useToast();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const openInput = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    try {
      setIsPending(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('toUpdate', type === 'profile' ? 'profilePhoto' : 'coverPhoto');

      const res = await fetch('/api/users/photo', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to update photo');
      }

      const data = await res.json();

      // Invalidate user cache to refresh data
      await invalidateUserCache(queryClient, userId);

      showToast({
        type: 'success',
        title: 'Success',
        message: 'Photo updated successfully',
      });

      return data.uploadedTo;
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update photo',
      });
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  const savePositionY = async (positionY: number) => {
    if (!userId) return;

    try {
      setIsPending(true);
      const res = await fetch(`/api/users/${userId}/cover-position`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ positionY }),
      });

      if (!res.ok) {
        throw new Error('Failed to save position');
      }

      await invalidateUserCache(queryClient, userId);

      showToast({
        type: 'success',
        title: 'Success',
        message: 'Cover photo position saved',
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to save position',
      });
    } finally {
      setIsPending(false);
    }
  };

  return {
    inputFileRef,
    openInput,
    handleChange,
    savePositionY,
    isPending,
  };
}
