'use client';

import { DropdownMenuButton } from '@/components/ui/DropdownMenuButton';
import { HamburgerMenu } from '@/svg_components';
import { useRouter } from 'next/navigation';
import { Item, Section } from 'react-stately';

export function HomeMobileDropdownMenu() {
  const router = useRouter();
  return (
    <DropdownMenuButton
      key="home-dropdown-menu"
      label="Home dropdown menu"
      onAction={(key) => router.push(key as string)}
      Icon={HamburgerMenu}>
      <Section>
        {/* <Item key="/terms">Terms</Item>
        <Item key="/privacy-policy">Privacy Policy</Item> */}
        {/* <Item key="/discover">Discover</Item> */}
        <Item key="/login">Login</Item>
      </Section>
    </DropdownMenuButton>
  );
}
