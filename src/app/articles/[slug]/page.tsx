import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { Clock3, CalendarDays, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
import { SmartImage } from '@/components/ui/SmartImage';
import { Badge } from '@/components/ui/Badge';
import { ArticleCard } from '@/components/content/Cards';
import { getAllArticles, getArticleBySlug, getArticleSlugs, getRelatedArticles, formatDateCN } from '@/lib/articles';
import { siteConfig } from '@/lib/site';

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = getArticleBySlug(slug);
  if (!data) return { title: '文章未找到' };
  const { meta } = data;
  return {
    title: meta.title,
    description: meta.excerpt,
    keywords: meta.tags,
    openGraph: {
      type: 'article',
      title: `${meta.title} | ${siteConfig.name}`,
      description: meta.excerpt,
      publishedTime: meta.date,
      images: meta.cover ? [{ url: meta.cover }] : undefined,
      locale: 'zh_CN',
    },
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getArticleBySlug(slug);
  if (!data) notFound();
  const { meta, content } = data;
  const related = getRelatedArticles(slug);
  const all = getAllArticles();
  const idx = all.findIndex((a) => a.slug === slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.excerpt,
    datePublished: meta.date,
    author: { '@type': 'Organization', name: meta.author ?? `${siteConfig.name} 编辑部` },
    publisher: { '@type': 'Organization', name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/articles/${slug}`,
    articleSection: meta.category,
    keywords: meta.tags.join(', '),
    ...(meta.cover ? { image: meta.cover } : {}),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-site pt-10 sm:pt-14">
        <Link href="/articles" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-caramel-600">
          <ArrowLeft className="h-4 w-4" /> 返回文章中心
        </Link>
      </div>

      <header className="container-site max-w-prose mx-auto pb-8 pt-8 text-center">
        <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
          <Badge tone="caramel">{meta.category}</Badge>
          <span className="flex items-center gap-1 text-xs text-ink-faint"><CalendarDays className="h-3.5 w-3.5" /> {formatDateCN(meta.date)}</span>
          <span className="flex items-center gap-1 text-xs text-ink-faint"><Clock3 className="h-3.5 w-3.5" /> 约 {meta.readMinutes} 分钟</span>
        </div>
        <h1 className="font-serif text-[2rem] font-bold leading-tight tracking-tight text-ink sm:text-[2.8rem]">{meta.title}</h1>
        {meta.subtitle && <p className="mt-4 font-serif text-lg text-ink-muted">{meta.subtitle}</p>}
        <p className="mt-6 text-base leading-relaxed text-ink-soft">{meta.excerpt}</p>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-faint">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink font-serif text-[11px] text-paper-50">编</span>
          {meta.author ?? `${siteConfig.name} 编辑部`}
        </div>
      </header>

      <div className="container-site mx-auto max-w-4xl">
        <SmartImage src={meta.cover} alt={meta.coverAlt} eager className="aspect-[21/9] w-full rounded-[18px] shadow-soft" />
      </div>

      <div className="container-site mx-auto max-w-prose py-12">
        <div className="prose-article">
          <MDXRemote
            source={content}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>

        <div className="mt-12 flex flex-wrap gap-2 border-t border-paper-200 pt-8">
          <Tag className="mr-1 mt-1.5 h-4 w-4 text-ink-faint" />
          {meta.tags.map((t) => (
            <span key={t} className="rounded-full bg-paper-100 px-3 py-1.5 text-xs text-ink-muted">#{t}</span>
          ))}
        </div>

        <nav className="mt-10 grid gap-3 sm:grid-cols-2">
          {prev ? (
            <Link href={`/articles/${prev.slug}`} className="card-base flex flex-col gap-1 p-4 hover:border-caramel-300">
              <span className="flex items-center gap-1 text-xs text-ink-faint"><ArrowLeft className="h-3 w-3" /> 上一篇</span>
              <span className="font-serif text-sm font-semibold text-ink">{prev.title}</span>
            </Link>
          ) : <div />}
          {next && (
            <Link href={`/articles/${next.slug}`} className="card-base flex flex-col gap-1 p-4 text-right hover:border-caramel-300">
              <span className="flex items-center justify-end gap-1 text-xs text-ink-faint">下一篇 <ArrowRight className="h-3 w-3" /></span>
              <span className="font-serif text-sm font-semibold text-ink">{next.title}</span>
            </Link>
          )}
        </nav>
      </div>

      {related.length > 0 && (
        <section className="border-t border-paper-200 bg-paper-100/50 py-14">
          <div className="container-site">
            <h2 className="section-title mb-7 text-xl sm:text-2xl">延伸阅读</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => <ArticleCard key={a.slug} article={a} />)}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
