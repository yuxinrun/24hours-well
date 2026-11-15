import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <section className="border-b border-paper-200 bg-paper-100/60 paper-texture">
      <div className="container-site py-12 sm:py-16">
        {breadcrumb && (
          <nav className="mb-5 flex items-center gap-1.5 text-xs text-ink-faint" aria-label="面包屑">
            <Link href="/" className="hover:text-caramel-600">首页</Link>
            {breadcrumb.map((b) => (
              <span key={b.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                {b.href ? <Link href={b.href} className="hover:text-caramel-600">{b.label}</Link> : <span className="text-ink-soft">{b.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[2.8rem]">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">{description}</p>
      </div>
    </section>
  );
}
