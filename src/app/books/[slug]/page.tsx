import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Lightbulb, Users, ListChecks, Info } from 'lucide-react';
import { books, getBook } from '@/data/books';
import { BookCover } from '@/components/content/Cards';
import { Badge } from '@/components/ui/Badge';

export function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const b = getBook(slug);
  if (!b) return { title: '书籍未找到' };
  return { title: `${b.title} — 全球好书`, description: `${b.title}：${b.coreIdeas[0]} 作者 ${b.author}。`, keywords: [b.title, b.author, b.category, '时间管理'] };
}

export default async function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = getBook(slug);
  if (!b) notFound();
  const related = b.relatedSlugs.map(getBook).filter(Boolean);

  const fields = [
    { label: '作者', value: `${b.author}（${b.authorEn}）` },
    { label: '国家 / 地区', value: b.country },
    { label: '出版年份', value: b.year },
    { label: '出版信息', value: b.publisher },
    { label: '原版书名', value: b.originalTitle },
  ];

  return (
    <>
      <div className="container-site pt-10 sm:pt-14">
        <Link href="/books" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-caramel-600">
          <ArrowLeft className="h-4 w-4" /> 返回书单
        </Link>
      </div>

      <section className="container-site py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
          <div className="mx-auto w-48 lg:mx-0 lg:w-full">
            <BookCover book={b} />
            {b.link && (
              <a href={b.link.url} target="_blank" rel="noopener noreferrer" className="mt-5 flex items-center justify-center gap-1.5 rounded-full border border-paper-300 py-2.5 text-xs font-medium text-ink-soft hover:border-caramel-400 hover:text-caramel-600">
                {b.link.label} <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge tone="caramel">{b.category}</Badge>
              {b.verified && <span className="inline-flex items-center gap-1 text-xs text-forest"><Info className="h-3.5 w-3.5" /> 出版信息依据公开资料整理</span>}
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">{b.title}</h1>
            <p className="mt-2 font-serif text-lg text-ink-muted">{b.originalTitle}</p>

            <dl className="mt-7 grid gap-x-8 gap-y-3 border-y border-paper-200 py-6 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.label} className="flex gap-3 text-sm">
                  <dt className="w-20 shrink-0 text-ink-faint">{f.label}</dt>
                  <dd className="text-ink-soft">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <h2 className="section-title mb-4 text-xl">核心观点</h2>
              <ul className="space-y-3">
                {b.coreIdeas.map((idea) => (
                  <li key={idea} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-caramel-400" /> {idea}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h2 className="section-title mb-4 text-xl">为什么值得读</h2>
              <p className="text-sm leading-[1.95] text-ink-soft">{b.whyRead}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-paper-200 bg-paper-100/60 py-14">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title mb-5 flex items-center gap-2 text-xl"><Users className="h-5 w-5 text-caramel-500" /> 适用人群</h2>
            <div className="flex flex-wrap gap-2">
              {b.suitableFor.map((s) => <span key={s} className="rounded-full bg-paper-50 px-4 py-2 text-sm text-ink-soft">{s}</span>)}
            </div>
          </div>
          <div>
            <h2 className="section-title mb-5 flex items-center gap-2 text-xl"><ListChecks className="h-5 w-5 text-caramel-500" /> 如何实践</h2>
            <ol className="space-y-3">
              {b.practice.map((p, i) => (
                <li key={p} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-soft font-serif text-xs font-bold text-forest">{i + 1}</span> {p}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-site py-14">
          <h2 className="section-title mb-6 flex items-center gap-2 text-xl"><Lightbulb className="h-5 w-5 text-caramel-500" /> 相关书籍</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link key={r!.slug} href={`/books/${r!.slug}`} className="card-base card-hover flex items-center gap-4 p-4">
                <BookCover book={r!} className="w-16 shrink-0" />
                <div>
                  <p className="font-serif text-sm font-bold text-ink">{r!.title}</p>
                  <p className="text-xs text-ink-muted">{r!.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
