'use client';

import { InfiniteData, QueryKey, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { GetPost, PostIds, PostIdsArray } from '@/types/definitions';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useOnScreen from '@/hooks/useOnScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { NO_PREV_DATA_LOADED, POSTS_PER_PAGE } from '@/constants';
import { chunk } from 'lodash';
import { useShouldAnimate } from '@/hooks/useShouldAnimate';
import { deductLowerMultiple } from '@/lib/deductLowerMultiple';
import SvgForwardArrow from '@/svg_components/ForwardArrow';
import { postFramerVariants } from '@/lib/framerVariants';
import { SomethingWentWrong } from './SometingWentWrong';
import { ButtonNaked } from './ui/ButtonNaked';
import { AllCaughtUp } from './AllCaughtUp';
import { Post } from './Post';
import { GenericLoading } from './GenericLoading';

// If the `type` is 'profile' or 'feed', the `userId` property is required
// If the `type` is 'hashtag', the `hashtag` property is required
type PostsProps =
  | {
      type: 'hashtag';
      userId?: undefined;
      hashtag: string;
    }
  | {
      type: 'profile' | 'feed';
      userId: string;
      hashtag?: undefined;
    };

export function PendingPosts({ type, hashtag, userId }: PostsProps) {
  const qc = useQueryClient();
  // Need to memoize `queryKey`, so when used in a dependency array, it won't trigger the `useEffect`/`useCallback`
  const queryKey = useMemo(
    () => (type === 'hashtag' ? ['pendingPosts', { hashtag }] : ['users', userId, 'pendingPosts', { type }]),
    [type, userId, hashtag],
  );

  const topElRef = useRef<HTMLDivElement>(null);
  const isTopOnScreen = useOnScreen(topElRef);
  const bottomElRef = useRef<HTMLDivElement>(null);
  const isBottomOnScreen = useOnScreen(bottomElRef);
  // `shouldAnimate` is `false` when the browser's back button is pressed
  // `true` when the page is pushed
  const { shouldAnimate } = useShouldAnimate();
  // This keeps track of the number of pages loaded by the `fetchPreviousPage()`
  const [numberOfNewPostsLoaded, setNumberOfNewPostsLoaded] = useState(0);

  const {
    data,
    error,
    isPending,
    isError,
    fetchNextPage, // Fetches (older) posts in 'descending' order, starting from the last page's last item (bottom of page)
    hasNextPage,
    fetchPreviousPage, // Fetches (newer) posts in 'ascending' order, starting from the latest page's latest item (top of page)
    isFetchingNextPage,
  } = useInfiniteQuery<PostIdsArray, Error, InfiniteData<PostIdsArray>, QueryKey, number>({
    queryKey,
    defaultPageParam: 0,
    queryFn: async ({ pageParam: cursor, direction }): Promise<PostIdsArray> => {
      const isForwards = direction === 'forward';
      const isBackwards = !isForwards;
      const params = new URLSearchParams('');

      // If the direction is 'backwards', load all new posts by setting a high `limit`
      params.set('limit', isForwards ? POSTS_PER_PAGE.toString() : '100');
      params.set('cursor', cursor.toString());
      params.set('sort-direction', isForwards ? 'desc' : 'asc');

      const fetchUrl = `/api/users/${userId}/pendingposts`;

      const res = await fetch(`${fetchUrl}?${params.toString()}`);

      if (!res.ok) throw Error('Failed to load posts.');
      const posts = (await res.json()) as GetPost[];

      if (!posts.length && isBackwards) {
        // Prevent React Query from 'prepending' the data with an empty array
        throw new Error(NO_PREV_DATA_LOADED);
      }

      if (isBackwards) {
        setNumberOfNewPostsLoaded((prev) => prev + posts.length);
      }

      const postIds = posts.map((post) => {
        // Set query data for each `post`, these queries will be used by the <Post> component
        qc.setQueryData(['posts', post.id], post);

        // If the `post` already exists in `data`, make sure to use its current `commentsShown`
        // value to prevent the post's comment section from closing if it is already shown
        const currentPostId = data?.pages.flat().find(({ id }) => id === post.id);
        return {
          id: post.id,
          commentsShown: currentPostId?.commentsShown || false,
        };
      });

      // When the direction is 'backwards', the `postIds` are in ascending order
      // Reverse it so that the latest post comes first in the array
      return isBackwards ? postIds.reverse() : postIds;
    },
    getNextPageParam: (lastPage, pages) => {
      if (pages.length === 0 || !lastPage.length) return undefined;
      return lastPage[lastPage.length - 1].id;
    },
    getPreviousPageParam: (firstPage) => {
      if (!firstPage?.length) return undefined;
      return firstPage[0].id;
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    // Reset the queries when the page has just been pushed, this is to account
    // for changes in the user's follows, e.g. if they start following people,
    // their posts must be shown in the user's feed
    if (shouldAnimate) {
      // Need to manually reset as the `staleTime` is set to `Infinity`
      qc.resetQueries({ queryKey, exact: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Check for new posts every 5 seconds, this allows for bidirectional infinite queries
    const interval = setInterval(fetchPreviousPage, 5000);
    return () => clearInterval(interval);
  }, [fetchPreviousPage]);

  useEffect(() => {
    if (isBottomOnScreen && hasNextPage) fetchNextPage();
  }, [isBottomOnScreen, hasNextPage, fetchNextPage]);

  useEffect(() => {
    // If top of <Posts> is on screen and the `numberOfNewPostsLoaded` is more than 0,
    // reset the `numberOfNewPostsLoaded`
    if (isTopOnScreen && numberOfNewPostsLoaded) {
      setTimeout(() => setNumberOfNewPostsLoaded(0), 1000);
    }
  }, [isTopOnScreen, numberOfNewPostsLoaded]);

  const viewNewlyLoadedPosts = () => {
    topElRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleComments = useCallback(
    async (postId: number) => {
      qc.setQueryData<InfiniteData<PostIdsArray>>(queryKey, (oldData) => {
        if (!oldData) return;
        const newPosts = oldData.pages.flat();
        const index = newPosts.findIndex((post) => post.id === postId);
        const oldPost = newPosts[index];
        newPosts[index] = {
          ...oldPost,
          commentsShown: !oldPost.commentsShown,
        };
        return {
          pages: chunk(newPosts, POSTS_PER_PAGE),
          pageParams: oldData.pageParams,
        };
      });
    },
    [qc, queryKey],
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Top ref and new posts notification - full width */}
      <div className="col-span-full">
        <div ref={topElRef} />
        <AnimatePresence>
          {numberOfNewPostsLoaded !== 0 && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="sticky top-5 z-10 mx-auto overflow-hidden">
              <ButtonNaked
                onPress={viewNewlyLoadedPosts}
                className="mt-4 inline-flex cursor-pointer select-none items-center gap-3 rounded-full bg-primary px-4 py-2 hover:bg-primary-accent">
                <div className="-rotate-90 rounded-full border-2 border-border bg-muted/70 p-[6px]">
                  <SvgForwardArrow className="h-5 w-5" />
                </div>
                <p className="text-primary-foreground">
                  <b>{numberOfNewPostsLoaded}</b> new {numberOfNewPostsLoaded > 1 ? 'posts' : 'post'} loaded
                </p>
              </ButtonNaked>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading state - full width */}
      {isPending ? (
        <div className="col-span-full">
          <GenericLoading>Loading posts</GenericLoading>
        </div>
      ) : (
        <AnimatePresence>
          {data?.pages.map((page) =>
            page.map((post) => (
              <motion.div
                variants={postFramerVariants}
                initial={shouldAnimate ? 'start' : false}
                animate="animate"
                exit="exit"
                transition={{
                  delay: deductLowerMultiple(post.id, POSTS_PER_PAGE) * 0.115,
                }}
                className="flex flex-col h-full space-y-0"
                key={post.id}
              >
                <Post 
                  id={post.id}
                  commentsShown={post.commentsShown} 
                  toggleComments={() => toggleComments(post.id)}
                  isPendingPage={true}
                  commentText=""
                />
              </motion.div>
            )),
          )}
        </AnimatePresence>
      )}

      {/* Bottom loader and states - full width */}
      <div className="col-span-full">
        <div
          className="min-h-[16px]"
          ref={bottomElRef}
          style={{ display: data ? 'block' : 'none' }}>
          {isFetchingNextPage && <GenericLoading>Loading more posts...</GenericLoading>}
        </div>
        
        {isError && error.message !== NO_PREV_DATA_LOADED && (
          <SomethingWentWrong />
        )}
        
        {!isPending && !isFetchingNextPage && !hasNextPage && (
          <AllCaughtUp />
        )}
      </div>
    </div>
  );
}
