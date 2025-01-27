///This are the tabs for post photos about pending 

'use client';

import { TabButton } from '@/components/TabButton';
import { usePathname, useSelectedLayoutSegment } from 'next/navigation';

export default function Tabs({ isOwnProfile }: { isOwnProfile: boolean }) {
  const selectedSegment = useSelectedLayoutSegment();
  const parentLayoutSegment = `/${usePathname().split('/')[1]}/${usePathname().split('/')[2]}`;

  return (
    <div className="mx-auto max-w-2xl w-full mt-4 flex justify-center gap-6 overflow-x-auto border-b-[1px] border-muted">
      {[
        { title: 'Posts', segment: parentLayoutSegment },
        { title: 'Photos', segment: `${parentLayoutSegment}/photos` },
        { title: 'About', segment: `${parentLayoutSegment}/about` },
        ...[isOwnProfile ? { title: 'Pending', segment: `${parentLayoutSegment}/pending` } : undefined],
      ].map((item) => {
        if (!item) return;
        const { title, segment } = item;
        const isActive =
          (selectedSegment === null ? parentLayoutSegment : `${parentLayoutSegment}/${selectedSegment}`) === segment;
        return <TabButton key={segment} title={title} isActive={isActive} href={segment} />;
      })}
    </div>
  );
}
