import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { MethodCard } from '@/components/content/Cards';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { methods } from '@/data/methods';
import { books } from '@/data/books';
import { Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '时间管理方法',
  description: '系统整理 GTD、番茄工作法、时间分块、深度工作、艾森豪威尔矩阵等 12 种时间管理方法，包含适用场景、操作步骤与实践案例。',
  openGraph: { title: '时间管理方法 | 好好度过24小时', description: '12 种经典时间管理方法，含操作步骤与实践案例。' },
};

export default function MethodsPage() {
  return (
    <>
      <PageHero
        eyebrow="Methods & Frameworks"
        title="时间管理方法"
        description="方法不是越多越好，关键是找到适合你当下处境的那一套。这里系统整理了 12 种经典方法，每一种都包含简要说明、适用场景、操作步骤和实践案例。"
        breadcrumb={[{ label: '时间管理方法' }]}
      />
      <div className="container-site py-12">
        <SectionHeading eyebrow="All Methods" title="12 种方法，逐一了解" description="点击卡片查看完整的方法详解。" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map((m) => <MethodCard key={m.slug} method={m} />)}
        </div>
      </div>

      <section className="border-t border-paper-200 bg-paper-100/60 py-14">
        <div className="container-site">
          <SectionHeading
            eyebrow="Further Reading"
            title="配合这些方法一起读"
            description="许多方法源自或概述于以下经典著作，阅读原著能获得更完整的语境。"
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {books.slice(0, 6).map((b) => (
              <Link key={b.slug} href={`/books/${b.slug}`} className="card-base card-hover flex items-center gap-3 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-caramel-100 text-caramel-600"><LinkIcon className="h-4 w-4" /></span>
                <div>
                  <p className="font-serif text-sm font-bold text-ink">{b.title}</p>
                  <p className="text-xs text-ink-muted">{b.author} · {b.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
