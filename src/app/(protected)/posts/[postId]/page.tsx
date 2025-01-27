'use client';

import { Post } from '@/components/Post';
import { useState } from 'react';

export default function Page({ params }: { params: { postId: string } }) {
  const postId = params.postId;
  const [commentsShown, setCommentsShown] = useState(true);

  const toggleComments = async () => {
    setCommentsShown(!commentsShown);
  };

  return (
    <div className="m-4">
      <Post 
        id={Number(postId)} 
        commentsShown={commentsShown} 
        toggleComments={toggleComments}
        commentText="" 
      />
    </div>
  );
}
