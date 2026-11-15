import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Globe2, Target, Newspaper, HeartHandshake, Users, Info } from 'lucide-react';
import { websites, getWebsite } from '@/data/websites';
import { Badge } from '@/components/ui/Badge';

export function generateStaticParams() {
  return websites.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const w = getWebsite(slug);
  if (!w) return { title: '网站未找到' };
  return { title: `${w.name} — 全球优质网站`, description: `${w.name}：${w.positioning} ${w.value}`, keywords: [w.name, w.category, '效率工具'] };
}

export default async function WebsiteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = getWebsite(slug);
  if (!w) notFound();

  const info = [
    { icon: Target, label: '网站定位', value: w.positioning },
    { icon: Newspaper, label: '主要内容', value: w.mainContent },
    { icon: HeartHandshake, label: '实用价值', value: w.value },
    { icon: Info, label: '推荐理由', value: w.reason },
  ];

  return (
    <>
      <div className="container-site pt-10 sm:pt-14">
        <Link href="/websites" className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-caramel-600">
          <ArrowLeft className="h-4 w-4" /> 返回网站库
        </Link>
      </div>

      <section className="container-site py-10">
        <div className="card-base flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-forest text-white"><Globe2 className="h-6 w-6" /></span>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-3xl font-bold text-ink">{w.name}</h1>
                <Badge tone="forest">{w.category}</Badge>
              </div>
              <p className="text-sm text-ink-muted">{w.positioning}</p>
              {w.region && <p className="mt-1 text-xs text-ink-faint">地区：{w.region}</p>}
            </div>
          </div>
          <a href={w.url} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">
            访问官方网站 <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {info.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="card-base p-6">
                <h2 className="mb-3 flex items-center gap-2 font-serif text-base font-bold text-ink">
                  <Icon className="h-4 w-4 text-caramel-500" /> {item.label}
                </h2>
                <p className="text-sm leading-[1.9] text-ink-soft">{item.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 card-base p-6">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-base font-bold text-ink"><Users className="h-4 w-4 text-caramel-500" /> 适用人群</h2>
          <div className="flex flex-wrap gap-2">
            {w.suitableFor.map((s) => <span key={s} className="rounded-full bg-forest-soft px-4 py-2 text-sm text-forest">{s}</span>)}
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-lg bg-paper-100 p-4 text-xs leading-relaxed text-ink-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-caramel-500" />
          <p>本站仅提供导航与介绍，网站内容为第三方所有，可能随时间变化。地区信息仅在可核实时提供。如链接失效，欢迎反馈。</p>
        </div>
      </section>
    </>
  );
}
