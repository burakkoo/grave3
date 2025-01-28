'use client';

import { useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import { useDialogs } from './useDialogs';
import { useToast } from './useToast';
import { invalidateUserCache, userKeys } from '@/lib/cache/userCache';
import { useSessionUserDataMutation } from './mutations/useSessionUserDataMutation';
import { useQueryClient } from '@tanstack/react-query';

export function useUpdateProfileAndCoverPhotoClient(type: 'profile' | 'cover') {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { updateSessionUserPhotosMutation, updatePositionYMutation } = useSessionUserDataMutation();
  const { alert } = useDialogs();
  const { showToast } = useToast();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const openInput = () => {
    if (inputFileRef.current == null) return;
    inputFileRef.current.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsPending(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('toUpdate', type === 'profile' ? 'profilePhoto' : 'coverPhoto');

      const res = await fetch('/api/users/photo', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to update photo');
      
      const data = await res.json();
      
      // Optimistically update cache
      queryClient.setQueryData(userKeys.all, (oldData: any) => ({
        ...oldData,
        [type === 'profile' ? 'profilePhoto' : 'coverPhoto']: data.uploadedTo,
      }));

      // Invalidate relevant caches
      await invalidateUserCache(queryClient, data.userId);

      showToast({
        type: 'success',
        title: 'Success',
        message: 'Photo updated successfully',
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update photo',
      });
    } finally {
      setIsPending(false);
    }
  };

  // Separate function for saving positionY
  const savePositionY = async (positionY: number) => {
    if (!userId || type !== 'cover') return;

    updatePositionYMutation.mutate(
      { userId, positionY },
      {
        onSuccess: () => {
          showToast({
            title: 'Success!',
            message: 'Cover photo position saved.',
            type: 'success',
          });
        },
        onError: () => {
          alert({
            title: 'Position Save Error',
            message: 'There was an error saving the cover photo position.',
          });
        },
      },
    );
  };

  return {
    inputFileRef,
    openInput,
    handleChange,
    savePositionY,
    isPending,
  };
}
