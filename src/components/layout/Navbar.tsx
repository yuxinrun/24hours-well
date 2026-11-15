'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Clock3 } from 'lucide-react';
import { mainNav, siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) => {
    const base = href.split('?')[0];
    if (base === '/') return pathname === '/';
    return pathname === base || pathname.startsWith(base + '/');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        scrolled ? 'border-paper-300 bg-paper-50/95 backdrop-blur-md shadow-soft' : 'border-transparent bg-paper-50'
      )}
    >
      <div className="container-site flex h-[68px] items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${siteConfig.name} 首页`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper-50 transition-colors group-hover:bg-caramel-500">
            <Clock3 className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[17px] font-bold tracking-tight text-ink">{siteConfig.name}</span>
            <span className="mt-1 text-[9px] font-medium uppercase tracking-[0.16em] text-ink-muted">24 Hours, Well Lived.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="主导航">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors',
                isActive(item.href) ? 'text-caramel-600' : 'text-ink-soft hover:text-ink'
              )}
            >
              {item.label}
              {isActive(item.href) && <span className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-caramel-400" />}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/lab/24-hours"
            className="rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-paper-50 transition-colors hover:bg-caramel-500"
          >
            开始探索 →
          </Link>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-paper-300 text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 top-[68px] z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <nav className="relative max-h-[calc(100vh-68px)] overflow-y-auto border-b border-paper-300 bg-paper-50 px-5 py-5 shadow-lift" aria-label="移动端导航">
            <div className="mx-auto flex max-w-content flex-col">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between border-b border-paper-200 py-4 font-serif text-lg',
                    isActive(item.href) ? 'text-caramel-600' : 'text-ink'
                  )}
                >
                  {item.label}
                  <span className="text-ink-faint">→</span>
                </Link>
              ))}
              <Link href="/lab/24-hours" className="btn-primary mt-6 w-full">
                探索 24 小时分配器
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
