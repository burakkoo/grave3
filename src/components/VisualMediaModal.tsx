'use client';

import { GetVisualMedia } from '@/types/definitions';
import { useSession } from 'next-auth/react';
import { useDialogs } from '@/hooks/useDialogs';
import { useToast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ButtonNaked } from './ui/ButtonNaked';
import SvgTrash from '@/svg_components/Trash';
import SvgClose from '@/svg_components/Close';
import { useState, useEffect, useRef } from 'react';

interface VisualMediaModalProps {
  visualMedia: (GetVisualMedia & {
    autoPlay?: boolean;
    controls?: boolean;
    muted?: boolean;
    loop?: boolean;
  })[];
  initialSlide: number;
  profileId: string;
  onCloseRef: React.MutableRefObject<(() => void) | undefined>;
  isVideo?: boolean;
}

export function VisualMediaModal({ visualMedia, initialSlide, profileId, onCloseRef, isVideo }: VisualMediaModalProps) {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const { data: session } = useSession();
  const { confirm } = useDialogs();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Add debug logging
  useEffect(() => {
    console.log('Current media:', visualMedia[currentSlide]);
    console.log('Is video?:', visualMedia[currentSlide].type === 'VIDEO');
  }, [currentSlide, visualMedia]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCloseRef]);

  // Add video ref to control playback
  const videoRef = useRef<HTMLVideoElement>(null);

  const deletePhotoMutation = useMutation({
    mutationFn: async (photoUrl: string) => {
      const res = await fetch(`/api/photos/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoUrl }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete photo');
      }
      return data;
    },
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['profile', profileId, 'photos'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['profile', profileId] });
      showToast({ title: 'Photo deleted successfully', type: 'success' });
      onCloseRef.current?.(); // Close modal after successful deletion
    },
    onError: (error: Error) => {
      showToast({ 
        title: error.message || 'Failed to delete photo', 
        type: 'error' 
      });
    },
  });

  const handleDelete = (photoUrl: string) => {
    confirm({
      title: 'Delete Photo',
      message: 'Are you sure you want to delete this photo? This will also delete the corresponding post.',
      onConfirm: () => {
        setTimeout(() => {
          deletePhotoMutation.mutate(photoUrl);
        }, 300);
      },
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCloseRef.current?.();
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="relative bg-background/95 backdrop-blur-sm rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with close and delete buttons */}
        <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/50 via-black/25 to-transparent z-20 flex items-center justify-between px-4">
          {session?.user?.id === profileId && (
            <ButtonNaked
              onPress={() => handleDelete(visualMedia[currentSlide].url)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all"
              aria-label="Delete photo"
              isDisabled={deletePhotoMutation.isPending}
            >
              <SvgTrash className="h-4 w-4" />
              <span>Delete</span>
            </ButtonNaked>
          )}
          
          <ButtonNaked
            onPress={onCloseRef.current?.bind(null)}
            className="flex items-center justify-center w-9 h-9 text-white/90 hover:text-white hover:bg-white/10 rounded-full ml-auto transition-all"
            aria-label="Close modal"
          >
            <SvgClose className="h-5 w-5" stroke="currentColor" />
          </ButtonNaked>
        </div>

        {/* Media container */}
        <div className="relative bg-black/10">
          {visualMedia[currentSlide].type === 'VIDEO' ? (
            <video
              ref={videoRef}
              key={visualMedia[currentSlide].url}
              className="object-contain w-full max-h-[80vh] mx-auto cursor-pointer"
              controls
              playsInline
              loop
              preload="auto"
              controlsList="nodownload"
              onClick={handleVideoClick}
            >
              <source 
                src={visualMedia[currentSlide].url} 
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img 
              src={visualMedia[currentSlide].url} 
              alt={visualMedia[currentSlide].caption || 'Photo'} 
              className="object-contain w-full max-h-[80vh] mx-auto"
            />
          )}
        </div>

        {/* Caption */}
        {visualMedia[currentSlide].caption && (
          <div className="p-4 bg-background/95 backdrop-blur-sm border-t border-border/50">
            <p className="text-sm text-foreground/80" id="modal-title">
              {visualMedia[currentSlide].caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 