'use client';

import { PendingPosts } from '@/components/PendingPosts';
import { PendingComments } from '@/components/PendingComments';
import { useState } from 'react';
import { cn } from '@/lib/cn';

type Tab = 'posts' | 'comments';

export function PendingContent({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState<Tab>('posts');

  return (
    <div className="flex flex-col">
      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 mb-4 flex rounded-lg bg-card shadow-sm">
        <button
          onClick={() => setActiveTab('posts')}
          className={cn(
            'flex-1 rounded-l-lg px-4 py-3 text-sm font-medium transition-colors',
            activeTab === 'posts'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          )}
        >
          Pending Posts
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={cn(
            'flex-1 rounded-r-lg px-4 py-3 text-sm font-medium transition-colors',
            activeTab === 'comments'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          )}
        >
          Pending Comments
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[calc(100vh-12rem)]">
        {/* Keep both components mounted but hide inactive one */}
        <div className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2",
          activeTab === 'posts' 
            ? "animate-in fade-in slide-in-from-left duration-300" 
            : "hidden"
        )}>
          <PendingPosts type="profile" userId={userId} />
        </div>
        
        <div className={cn(
          activeTab === 'comments'
            ? "animate-in fade-in slide-in-from-right duration-300"
            : "hidden"
        )}>
          <PendingComments userId={userId} />
        </div>
      </div>
    </div>
  );
} 