import Button from '@/components/ui/Button';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GetVisualMedia } from '@/types/definitions';
import { useWritePostMutations } from '@/hooks/mutations/useWritePostMutations';
import { useDialogs } from '@/hooks/useDialogs';
import { capitalize } from 'lodash';
import { revokeVisualMediaObjectUrls } from '@/lib/revokeVisualMediaObjectUrls';
import { ToEditValues } from '@/lib/createPost';
import { TextAreaWithMentionsAndHashTags } from './TextAreaWithMentionsAndHashTags';
import { GenericDialog } from './GenericDialog';
import { CreatePostSort } from './CreatePostSort';
import { ProfilePhotoOwn } from './ui/ProfilePhotoOwn';
import { CreatePostOptions } from './CreatePostOptions';
import { useSessionUserData } from '@/hooks/useSessionUserData';
import RecaptchaComponent from './RecaptchaComponent'; // Corrected import path
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';

const APPROVAL_MESSAGES = {
  post: "Your post has been submitted successfully! It will be visible once approved by the profile owner.",
  comment: "Your comment has been submitted successfully! It will be visible once approved by the profile owner."
} as const;

const MAX_VISIBLE_MEDIA = 4;
const MAX_IMAGE_SIZE = 1080;
const ASPECT_RATIOS = {
  MAX_LANDSCAPE: 1.91 / 1,  // 1.91:1 (maximum width:height ratio)
  MIN_PORTRAIT: 4 / 5,      // 4:5 (minimum width:height ratio)
};

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const MAX_VIDEO_SIZE_MB = 100; // 100MB max video size

function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(file);
        return;
      }

      // Calculate current aspect ratio
      let currentRatio = img.width / img.height;
      
      // Clamp the aspect ratio within Instagram's limits
      if (currentRatio > ASPECT_RATIOS.MAX_LANDSCAPE) {
        // Too wide - scale height up to match max landscape ratio
        const newHeight = img.width / ASPECT_RATIOS.MAX_LANDSCAPE;
        canvas.width = img.width;
        canvas.height = newHeight;
      } else if (currentRatio < ASPECT_RATIOS.MIN_PORTRAIT) {
        // Too tall - scale width up to match min portrait ratio
        const newWidth = img.height * ASPECT_RATIOS.MIN_PORTRAIT;
        canvas.width = newWidth;
        canvas.height = img.height;
      } else {
        // Aspect ratio is within acceptable range - maintain original ratio
        canvas.width = img.width;
        canvas.height = img.height;
      }

      // Scale down if dimensions exceed Instagram's max size
      if (canvas.width > MAX_IMAGE_SIZE || canvas.height > MAX_IMAGE_SIZE) {
        const scale = Math.min(
          MAX_IMAGE_SIZE / canvas.width,
          MAX_IMAGE_SIZE / canvas.height
        );
        canvas.width *= scale;
        canvas.height *= scale;
      }

      // Ensure dimensions are at least 320px
      const MIN_SIZE = 320;
      if (canvas.width < MIN_SIZE || canvas.height < MIN_SIZE) {
        const scale = Math.max(
          MIN_SIZE / canvas.width,
          MIN_SIZE / canvas.height
        );
        canvas.width *= scale;
        canvas.height *= scale;
      }

      // Draw image maintaining aspect ratio
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        0.95  // Increased quality
      );
    };

    img.onerror = () => resolve(file);
  });
}

export function CreatePostDialog({
  toEditValues,
  shouldOpenFileInputOnMount,
  setShown,
  profileId,
  userId,
}: {
  toEditValues: ToEditValues | null;
  shouldOpenFileInputOnMount: boolean;
  setShown: (isOpen: boolean) => void;
  profileId: string;
  userId: string;
}) {
  const isOwnProfile = userId === profileId;

  const mode: 'create' | 'edit' = toEditValues === null ? 'create' : 'edit';
  const [content, setContent] = useState(toEditValues?.initialContent || '');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [visualMedia, setVisualMedia] = useState<GetVisualMedia[]>(toEditValues?.initialVisualMedia ?? []);

  // Add state for Name and Relation
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');

  const [isPosting, setIsPosting] = useState(false);

  const exitCreatePostModal = useCallback(() => setShown(false), [setShown]);
  const { createPostMutation, updatePostMutation } = useWritePostMutations({
    content,
    visualMedia,
    profileId,
    name,
    relation,
    exitCreatePostModal,
  });
  const { confirm } = useDialogs();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const visibleMedia = useMemo(() => {
    if (visualMedia.length <= MAX_VISIBLE_MEDIA) return visualMedia;
    return visualMedia.slice(0, MAX_VISIBLE_MEDIA);
  }, [visualMedia]);

  const remainingMediaCount = visualMedia.length - MAX_VISIBLE_MEDIA;

  const handleVisualMediaChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(async (e) => {
    const { files } = e.target;
    if (!files?.length || visualMedia.length >= MAX_VISIBLE_MEDIA) return;

    const filesArr = Array.from(files).slice(0, MAX_VISIBLE_MEDIA - visualMedia.length);
    
    const processedMedia = await Promise.all(
      filesArr.map(async (file) => {
        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(file.type) && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
          showToast({
            title: "Invalid file type. Please upload only images (JPG, PNG, WebP, GIF) or videos (MP4, MOV, WebM)",
            type: "error"
          });
          return null;
        }

        // Handle images
        if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
          const resizedBlob = await resizeImage(file);
          return {
            type: 'PHOTO' as const,
            url: URL.createObjectURL(resizedBlob),
            caption: null,
          };
        } 
        // Handle videos
        else if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
          // Check video size
          if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
            showToast({
              title: `Video must be smaller than ${MAX_VIDEO_SIZE_MB}MB`,
              type: "error"
            });
            return null;
          }

          return {
            type: 'VIDEO' as const,
            url: URL.createObjectURL(file),
            caption: null,
          };
        }

        return null;
      })
    );

    // Filter out null values and add valid media
    const validMedia = processedMedia.filter((media): media is { type: "PHOTO" | "VIDEO"; url: string; caption: null } => 
      media !== null && (media.type === "PHOTO" || media.type === "VIDEO")
    ) as GetVisualMedia[];
    
    setVisualMedia((prev) => {
      const newMedia = [...prev, ...validMedia];
      return newMedia.slice(0, MAX_VISIBLE_MEDIA);
    });
    
    e.target.value = '';
  }, [visualMedia, showToast]);

  const handleClickPostButton = useCallback(async () => {
    if (isPosting) return;
    if (!recaptchaToken) {
      alert('Please complete the reCAPTCHA.');
      return;
    }

    setIsPosting(true);
    try {
      // Example of sending token to your backend for verification
      const response = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: recaptchaToken }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('reCAPTCHA verification successful.');
        // Continue with your form submission or other logic
      } else {
        console.error('reCAPTCHA verification failed.');
      }

      if (mode === 'create') {
        await createPostMutation.mutateAsync();
      } else {
        if (!toEditValues) return;
        await updatePostMutation.mutateAsync({ postId: toEditValues.postId });
      }
    } finally {
      setIsPosting(false);
    }
  }, [createPostMutation, mode, recaptchaToken, toEditValues, updatePostMutation, isPosting]);

  const exit = useCallback(() => {
    exitCreatePostModal();
    revokeVisualMediaObjectUrls(visualMedia);
  }, [exitCreatePostModal, visualMedia]);

  const confirmExit = useCallback(() => {
    confirm({
      title: 'Unsaved Changes',
      message: 'Do you really wish to exit?',
      onConfirm: () => setTimeout(() => exit(), 300),
    });
  }, [confirm, exit]);

  const handleClose = useCallback(() => {
    if (mode === 'create') {
      if (content !== '' || visualMedia.length > 0) {
        confirmExit();
        return;
      }
    } else if (mode === 'edit') {
      if (content !== toEditValues?.initialContent || visualMedia !== toEditValues.initialVisualMedia) {
        confirmExit();
        return;
      }
    }
    exit();
  }, [confirmExit, content, visualMedia, mode, toEditValues, exit]);

  const sortVariants = useMemo(
    () => ({
      initial: { height: 0 },
      animate: { height: 'auto' },
      exit: { height: 0 },
    }),
    [],
  );

  useEffect(() => {
    if (inputFileRef.current === null) return;
    if (shouldOpenFileInputOnMount) inputFileRef.current.click();
  }, [shouldOpenFileInputOnMount]);

  useEffect(() => {
    if (textareaRef.current === null) return;
    textareaRef.current.focus();
  }, []);

  useEffect(() => {
    const onEscPressed = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    document.addEventListener('keydown', onEscPressed, false);
    return () => {
      document.removeEventListener('keydown', onEscPressed, false);
    };
  }, [handleClose]);

  return (
    <GenericDialog 
      title={`${capitalize(mode)} Post`} 
      handleClose={handleClose}
      className="sm:mt-0 mt-0 sm:translate-y-0 translate-y-0"
    >
      <div className="flex flex-col space-y-3 p-3 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="flex items-start space-x-3">
          {userId && (
            <div className="h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10">
              <ProfilePhotoOwn />
            </div>
          )}
          <div className="flex-1">
            <TextAreaWithMentionsAndHashTags 
              content={content} 
              setContent={setContent} 
              placeholder="Enter a note..." 
              className="min-h-[80px] w-full rounded-md border border-border bg-background p-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary [&>*]:text-white sm:min-h-[100px] sm:p-3"
            />
            
            {!isOwnProfile && (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-border bg-background p-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="w-full rounded-md border border-border bg-background p-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="" className="text-white bg-background">Select Relation</option>
                  <option value="Friend" className="text-white bg-background">Friend</option>
                  <option value="Family" className="text-white bg-background">Family</option>
                  <option value="Other" className="text-white bg-background">Other</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <CreatePostOptions 
              handleVisualMediaChange={handleVisualMediaChange} 
              ref={inputFileRef}
              visualMedia={visualMedia}
              MAX_VISIBLE_MEDIA={MAX_VISIBLE_MEDIA}
            />
            
            <Button
              onPress={handleClickPostButton}
              mode="primary"
              size="large"
              isDisabled={content === '' && visualMedia.length === 0 || isPosting}
              loading={createPostMutation.isPending || updatePostMutation.isPending || isPosting}
            >
              Post
            </Button>
          </div>

          <div className="flex justify-center scale-75 origin-top">
            <RecaptchaComponent onVerify={setRecaptchaToken} />
          </div>
        </div>
        
        <AnimatePresence>
          {visualMedia.length > 0 && (
            <motion.div
              variants={sortVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="overflow-hidden"
            >
              <div className={`grid gap-2 ${
                visualMedia.length === 1 ? 'grid-cols-1' : 
                visualMedia.length === 2 ? 'grid-cols-2' : 
                'grid-cols-2 sm:grid-cols-4'
              }`}>
                {visibleMedia.map((media, index) => (
                  <div 
                    key={media.url} 
                    className={`relative w-full ${
                      visualMedia.length === 1 
                        ? 'max-w-[400px] mx-auto'
                        : ''
                    }`}
                  >
                    <div className={`relative ${
                      visualMedia.length === 1 
                        ? 'pb-[125%]'
                        : 'pb-[125%]'
                    }`}>
                      {media.type === 'PHOTO' ? (
                        <img
                          src={media.url}
                          alt=""
                          className="absolute inset-0 h-full w-full rounded-md object-contain bg-gray-900"
                        />
                      ) : (
                        <video
                          src={media.url}
                          className="absolute inset-0 h-full w-full rounded-md object-contain bg-gray-900"
                          controls
                          controlsList="nodownload"
                          playsInline
                          preload="metadata"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                      <button
                        onClick={() => setVisualMedia(prev => prev.filter((_, i) => i !== index))}
                        className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 hover:bg-black/70"
                      >
                        <span className="sr-only">Remove</span>
                        <svg className="h-4 w-4 text-white" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {index === MAX_VISIBLE_MEDIA - 1 && remainingMediaCount > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-md">
                          <span className="text-lg font-medium">+{remainingMediaCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GenericDialog>
  );
}
