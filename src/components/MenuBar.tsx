'use client';
import { Feather, GridFeedCards, LogOutCircle, NotificationBell, Profile, Search } from '@/svg_components';
import { useSessionUserData } from '@/hooks/useSessionUserData';
import { useNotificationsCountQuery } from '@/hooks/queries/useNotificationsCountQuery';
import Link from 'next/link';
import { LogoText } from './LogoText';
import { MenuBarItem } from './MenuBarItem';
import { useState } from 'react';

export function MenuBar() {
  const [user] = useSessionUserData();
  const username = user?.username || 'user-not-found';
  const { data: notificationCount } = useNotificationsCountQuery();

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed bottom-0 z-[2] flex w-full bg-background/70 shadow-inner backdrop-blur-sm md:sticky md:top-0 md:h-screen ${
        isExpanded ? 'md:w-[212px]' : 'md:w-[70px]'
      } transition-all duration-300 md:flex-col md:items-start md:bg-inherit md:p-4 md:pr-1 md:shadow-none md:backdrop-blur-none`}>
      <Link href="/" title="Home" className="mb-4 hidden items-center gap-2 md:flex">
        <Feather className="h-12 w-12 stroke-primary" />
        {isExpanded && <LogoText className="text-3xl" />}
      </Link>
      {[
        // {
        //   title: 'Feed',
        //   Icon: GridFeedCards,
        //   route: '/feed',
        // },
        // {
        //   title: 'Discover',
        //   Icon: Search,
        //   route: '/discover',
        // },
        // {
        //   title: 'Notifications',
        //   Icon: NotificationBell,
        //   route: '/notifications',
        //   badge: notificationCount,
        // },
        // { title: 'My Profile', Icon: Profile, route: `/profile/${username}` },
        {
          title: 'Logout',
          Icon: LogOutCircle,
          route: '/api/auth/signout',
        },
      ].map((item, i) => (
        <MenuBarItem key={i} {...item} isExpanded={isExpanded}>
          {item.title}
        </MenuBarItem>
      ))}
    </div>
  );
}
