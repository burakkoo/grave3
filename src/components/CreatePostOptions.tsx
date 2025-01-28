'use client';

import React, { forwardRef, useCallback, useRef } from 'react';
import SvgImage from '@/svg_components/Image';
import { ButtonNaked } from './ui/ButtonNaked';

const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/webm'
].join(',');

export const CreatePostOptions = forwardRef<
  HTMLInputElement,
  {
    handleVisualMediaChange: React.ChangeEventHandler<HTMLInputElement>;
    visualMedia: any[];
    MAX_VISIBLE_MEDIA: number;
  }
>(({ handleVisualMediaChange, visualMedia, MAX_VISIBLE_MEDIA }, forwardedRef) => {
  const localRef = useRef<HTMLInputElement | null>(null);
  const isMediaLimitReached = visualMedia.length >= MAX_VISIBLE_MEDIA;

  const assignRef = useCallback(
    (node: HTMLInputElement) => {
      localRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    },
    [forwardedRef],
  );

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleVisualMediaChange(e);
        // Only reset after successful handling
        if (localRef.current) {
          localRef.current.value = '';
        }
      }
    },
    [handleVisualMediaChange]
  );

  const onUploadImageOrVideoPress = useCallback(() => {
    if (isMediaLimitReached) return;
    if (localRef.current) {
      localRef.current.click();
    }
  }, [isMediaLimitReached]);

  return (
    <div className="flex flex-row justify-center gap-6 px-4 pb-5 sm:justify-start">
      <ButtonNaked 
        aria-label="Upload an image or video" 
        className={`flex gap-4 ${isMediaLimitReached ? 'cursor-not-allowed opacity-50' : ''}`}
        onPress={onUploadImageOrVideoPress}
        isDisabled={isMediaLimitReached}
      >
        <input
          type="file"
          ref={assignRef}
          onChange={handleChange}
          accept={ACCEPTED_FILE_TYPES}
          className="hidden"
          multiple
          disabled={isMediaLimitReached}
        />
        <SvgImage className="h-6 w-6 text-muted-foreground" />
        <p className="text-base font-semibold text-muted-foreground group-hover:text-muted-foreground/80">
          {isMediaLimitReached ? 'Maximum media reached' : 'Add Image / Video'}
        </p>
      </ButtonNaked>
    </div>
  );
});

CreatePostOptions.displayName = 'CreatePostOptions';
