import { Feather } from '@/svg_components';
import { LogoText } from '@/components/LogoText';
import Link from 'next/link';
import { HomeMobileDropdownMenu } from './HomeMobileDropdownMenu';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="fixed left-0 top-0 z-50 w-full border-b border-border/40 bg-slate-900/95 backdrop-blur-sm">
        <div className="flex w-full items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/" title="Home page">
            <div className="flex cursor-pointer flex-row items-center gap-2">
              <Feather className="stroke-primary" width={32} height={32} />
              <LogoText className="text-2xl text-white" />
            </div>
          </Link>
          <div className="hidden gap-3 sm:flex">
            <HomeNavLink href="/login">Login</HomeNavLink>
          </div>
          <div className="sm:hidden">
            <HomeMobileDropdownMenu />
          </div>
        </div>
      </div>
      <div className="mt-16 flex flex-1 justify-center py-4 sm:py-8">
        <div className="w-full gap-3">{children}</div>
      </div>
    </div>
  );
}

function HomeNavLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <h3 className="cursor-pointer px-4 py-3 text-lg font-semibold text-gray-200 transition-colors hover:text-primary">
      <Link href={href}>{children}</Link>
    </h3>
  );
}
