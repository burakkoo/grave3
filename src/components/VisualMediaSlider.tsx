'use client';

import { GetVisualMedia } from '@/types/definitions';
import { useSession } from 'next-auth/react';
import { useDialogs } from '@/hooks/useDialogs';
import { useToast } from '@/hooks/useToast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ButtonNaked } from './ui/ButtonNaked';
import SvgTrash from '@/svg_components/Trash';
import SvgClose from '@/svg_components/Close';
import SvgChevronLeft from '@/svg_components/ChevronLeft';
import SvgChevronRight from '@/svg_components/ChevronRight';
import { useState, useEffect, useCallback } from 'react';

interface VisualMediaSliderProps {
  visualMedia: GetVisualMedia[];
  initialSlide: number;
  profileId: string;
  onClose: () => void;
}

export default function VisualMediaSlider({ 
  visualMedia, 
  initialSlide, 
  profileId, 
  onClose 
}: VisualMediaSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const { data: session } = useSession();
  const { confirm } = useDialogs();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const handlePrevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  const handleNextSlide = useCallback(() => {
    if (currentSlide < visualMedia.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide, visualMedia.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevSlide();
      if (e.key === 'ArrowRight') handleNextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handlePrevSlide, handleNextSlide]);

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
      onClose(); // Close modal after successful deletion
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
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-transparent hover:bg-black/5 transition-colors flex items-center justify-center p-4 cursor-pointer"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Navigation buttons */}
      {currentSlide > 0 && (
        <ButtonNaked
          onPress={handlePrevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 text-foreground/75 hover:text-foreground hover:bg-background/10 rounded-full transition-all z-30"
          aria-label="Previous photo"
        >
          <SvgChevronLeft className="h-5 w-5" />
        </ButtonNaked>
      )}
      
      {currentSlide < visualMedia.length - 1 && (
        <ButtonNaked
          onPress={handleNextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 text-foreground/75 hover:text-foreground hover:bg-background/10 rounded-full transition-all z-30"
          aria-label="Next photo"
        >
          <SvgChevronRight className="h-5 w-5" />
        </ButtonNaked>
      )}

      <div 
        className="relative bg-card rounded-xl overflow-hidden w-full max-w-[550px] shadow-xl cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-11 border-b border-border/10 bg-card">
          <div className="text-sm font-medium text-foreground/90">
            {currentSlide + 1} / {visualMedia.length}
          </div>

          <div className="flex items-center gap-3">
            {session?.user?.id === profileId && (
              <ButtonNaked
                onPress={() => handleDelete(visualMedia[currentSlide].url)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-foreground/90 hover:text-foreground hover:bg-background/10 rounded-full transition-all"
                aria-label="Delete photo"
                isDisabled={deletePhotoMutation.isPending}
              >
                <SvgTrash className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </ButtonNaked>
            )}

            {/* Close button - only on mobile */}
            <ButtonNaked
              onPress={onClose}
              className="sm:hidden flex items-center justify-center w-8 h-8 text-foreground/75 hover:text-foreground hover:bg-background/10 rounded-full transition-all"
              aria-label="Close modal"
            >
              <SvgClose className="h-5 w-5" stroke="currentColor" />
            </ButtonNaked>
          </div>
        </div>

        {/* Image */}
        <div className="aspect-square bg-background/5">
          <img 
            src={visualMedia[currentSlide].url} 
            alt={visualMedia[currentSlide].caption || 'Photo'} 
            className="object-contain w-full h-full"
          />
        </div>

        {/* Caption */}
        {visualMedia[currentSlide].caption && (
          <div className="p-3 bg-card border-t border-border/10">
            <p className="text-sm text-foreground/80" id="modal-title">
              {visualMedia[currentSlide].caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
