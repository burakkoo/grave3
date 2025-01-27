'use client';

import SvgSend from '@/svg_components/Send';
import { useCallback, useState } from 'react';
import { useCreateCommentMutations } from '@/hooks/mutations/useCreateCommentMutations';
import Button from './ui/Button';
import { TextAreaWithMentionsAndHashTags } from './TextAreaWithMentionsAndHashTags';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/cn';

// Define available relations
const RELATIONS = [
  'Family',
  'Friend',
  'Colleague',
  'Neighbor',
  'Classmate',
  'Other'
] as const;

type CreateCommentData = {
  postId: number;
  content: string;
  PostedBy: string;
  Relation: string | null;
}

const APPROVAL_MESSAGES = {
  comment: "Your comment has been submitted successfully! To maintain a respectful and appropriate environment, all comments need to be reviewed and approved by the profile owner before they become visible."
} as const;

const MAX_CHARS = 120;

export function CommentCreate({ postId }: { postId: number }) {
  const [content, setContent] = useState('');
  const [postedBy, setPostedBy] = useState('');
  const [relation, setRelation] = useState('');
  const { createCommentMutation } = useCreateCommentMutations();
  const { showToast } = useToast();

  const remainingChars = MAX_CHARS - content.length;
  const isOverLimit = remainingChars < 0;

  const handleCreate = useCallback(() => {
    if (!postedBy.trim()) {
      alert('Please enter your name');
      return;
    }
    
    if (!content.trim()) {
      alert('Please enter a comment');
      return;
    }

    const commentData: CreateCommentData = {
      postId, 
      content: content.trim(),
      PostedBy: postedBy.trim(),
      Relation: relation || null,
    };

    createCommentMutation.mutate(
      commentData,
      {
        onSuccess: () => {
          setContent('');
          setPostedBy('');
          setRelation('');
          showToast({
            title: 'Comment submitted!',
            message: APPROVAL_MESSAGES.comment,
            type: 'success'
          });
        },
        onError: (error) => {
          console.error('Error creating comment:', error);
          showToast({
            title: 'Error',
            message: 'Failed to create comment. Please try again.',
            type: 'error'
          });
        }
      },
    );
  }, [content, postedBy, relation, createCommentMutation, postId, showToast]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostedBy(e.target.value);
  };

  const handleRelationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRelation(e.target.value);
  };

  const handleContentChange = useCallback((newContent: string | ((prev: string) => string)) => {
    const value = typeof newContent === 'function' ? newContent(content) : newContent;
    if (value.length <= MAX_CHARS) {
      setContent(value);
    }
  }, [content]);

  return (
    <div className="mt-2 border-t-2 border-t-border py-4">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Your name (required)"
          value={postedBy}
          onChange={handleNameChange}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={relation}
          onChange={handleRelationChange}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select your relation</option>
          {RELATIONS.map((rel) => (
            <option key={rel} value={rel}>
              {rel}
            </option>
          ))}
        </select>
        <div className="flex flex-col">
          <div className="flex flex-1 flex-col justify-center">
            <TextAreaWithMentionsAndHashTags
              content={content}
              setContent={handleContentChange}
              placeholder="Write your comment here..."
              shouldFocusOnMount={false}
              className="w-full rounded-lg bg-muted/50 px-3 py-2"
            />
            <div className={cn(
              "text-xs mt-1 text-right",
              remainingChars <= 20 ? "text-warning" : "text-muted-foreground",
              remainingChars <= 0 ? "text-destructive" : ""
            )}>
              {remainingChars} characters remaining
            </div>
          </div>
          <div className="self-end">
            <Button
              onPress={handleCreate}
              mode="ghost"
              size="small"
              isDisabled={!content.trim() || !postedBy.trim() || isOverLimit}
              loading={createCommentMutation.isPending}
              Icon={SvgSend}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
