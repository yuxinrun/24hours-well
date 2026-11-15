'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  eager = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-paper-200 via-paper-100 to-caramel-100',
          className
        )}
        role="img"
        aria-label={alt}
      >
        <svg viewBox="0 0 400 240" className="absolute inset-0 h-full w-full opacity-60" aria-hidden="true">
          <circle cx="200" cy="120" r="70" fill="none" stroke="#D9A075" strokeWidth="1.5" />
          <circle cx="200" cy="120" r="52" fill="none" stroke="#C67C4B" strokeWidth="1" strokeDasharray="3 5" />
          <line x1="200" y1="120" x2="200" y2="72" stroke="#A8623C" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="200" y1="120" x2="238" y2="140" stroke="#A8623C" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="200" cy="120" r="4" fill="#A8623C" />
        </svg>
        <span className="relative z-10 max-w-[75%] text-center font-serif text-sm text-ink-muted">{alt}</span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden bg-paper-200', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        onError={() => setFailed(true)}
        className={cn('h-full w-full object-cover', imgClassName)}
      />
    </div>
  );
}
