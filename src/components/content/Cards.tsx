import Link from 'next/link';
import { ArrowUpRight, Clock3, BookOpen, ExternalLink, Globe2 } from 'lucide-react';
import {
  Inbox, Timer, CalendarDays, Brain, LayoutGrid, ChartNoAxesColumn,
  Zap, Hourglass, CalendarCheck2, Target, Eye, ShieldCheck, type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { SmartImage } from '@/components/ui/SmartImage';
import type { Article, Book, Method, Website } from '@/lib/types';
import { formatDateCN } from '@/lib/utils';

const methodIcons: Record<string, LucideIcon> = {
  inbox: Inbox,
  timer: Timer,
  calendar: CalendarDays,
  brain: Brain,
  grid: LayoutGrid,
  chart: ChartNoAxesColumn,
  zap: Zap,
  hourglass: Hourglass,
  'calendar-check': CalendarCheck2,
  target: Target,
  eye: Eye,
  'shield-check': ShieldCheck,
};

export function ArticleCard({ article, horizontal = false }: { article: Article; horizontal?: boolean }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`card-base card-hover group flex overflow-hidden ${horizontal ? 'flex-col sm:flex-row' : 'flex-col'}`}
    >
      <SmartImage
        src={article.cover}
        alt={article.coverAlt}
        className={horizontal ? 'aspect-[16/9] w-full sm:aspect-auto sm:w-40 sm:shrink-0' : 'aspect-[16/10] w-full'}
        imgClassName="transition-transform duration-500 group-hover:scale-105"
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2">
          <Badge tone="caramel">{article.category}</Badge>
          <span className="flex items-center gap-1 text-[11px] text-ink-faint">
            <Clock3 className="h-3 w-3" /> {article.readMinutes} 分钟
          </span>
        </div>
        <h3 className="font-serif text-lg font-bold leading-snug text-ink transition-colors group-hover:text-caramel-600">
          {article.title}
        </h3>
        {article.subtitle && <p className="mt-1 text-xs text-ink-faint">{article.subtitle}</p>}
        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-ink-muted">{article.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-ink-faint">
          <span>{formatDateCN(article.date)}</span>
          <span className="inline-flex items-center gap-1 font-medium text-caramel-500 opacity-0 transition-opacity group-hover:opacity-100">
            阅读 <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function MethodCard({ method }: { method: Method }) {
  const Icon = methodIcons[method.icon] ?? Target;
  return (
    <Link href={`/methods/${method.slug}`} className="card-base card-hover group flex flex-col p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${method.color}18`, color: method.color }}>
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <h3 className="font-serif text-lg font-bold text-ink transition-colors group-hover:text-caramel-600">{method.name}</h3>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-ink-faint">{method.enName}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-muted">{method.oneLiner}</p>
      <div className="mt-4 flex items-center justify-between border-t border-paper-200 pt-3 text-xs text-ink-faint">
        <span>{method.steps.length} 个步骤</span>
        <ArrowUpRight className="h-4 w-4 text-caramel-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}

export function BookCover({ book, className = '' }: { book: Book; className?: string }) {
  return (
    <div className={`relative flex aspect-[3/4] flex-col overflow-hidden rounded-md p-3 shadow-soft ${className}`} style={{ background: book.coverColor }}>
      <div className="absolute inset-x-2 top-2 bottom-2 rounded-sm border" style={{ borderColor: `${book.coverAccent}66` }} />
      <div className="relative z-10 flex flex-1 flex-col justify-between px-1.5 py-2">
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em]" style={{ color: book.coverAccent }}>24HW · READS</span>
        <div>
          <div className="mb-3 h-px w-8" style={{ background: book.coverAccent }} />
          <p className="font-serif text-sm font-bold leading-tight" style={{ color: book.coverAccent }}>{book.title}</p>
          <p className="mt-1.5 text-[9px] leading-snug" style={{ color: book.coverAccent, opacity: 0.85 }}>{book.author}</p>
        </div>
      </div>
    </div>
  );
}

export function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/books/${book.slug}`} className="card-base card-hover group flex gap-4 p-4">
      <BookCover book={book} className="w-20 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Badge tone="outline" className="mb-2 w-fit">{book.category}</Badge>
        <h3 className="font-serif text-base font-bold leading-snug text-ink transition-colors group-hover:text-caramel-600">{book.title}</h3>
        <p className="mt-1 text-xs text-ink-muted">{book.author} · {book.country}</p>
        <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-ink-muted">{book.coreIdeas[0]}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-caramel-500">
          查看详情 <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}

export function WebsiteCard({ site }: { site: Website }) {
  return (
    <div className="card-base card-hover group flex flex-col p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-soft text-forest">
            <Globe2 className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-serif text-base font-bold text-ink">{site.name}</h3>
            {site.region && <p className="text-[11px] text-ink-faint">{site.region}</p>}
          </div>
        </div>
        <Badge tone="forest" className="shrink-0">{site.category}</Badge>
      </div>
      <p className="text-sm leading-relaxed text-ink-soft">{site.positioning}</p>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-muted">{site.reason}</p>
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 border-t border-paper-200 pt-3 text-xs font-medium text-caramel-600 hover:text-caramel-700"
      >
        访问官网 <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

export function ReadingListIcon() {
  return <BookOpen className="h-4 w-4" />;
}
