import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, AlertTriangle, BookOpen, ArrowLeft, Users, Lightbulb } from 'lucide-react';
import { methods, getMethod } from '@/data/methods';
import { getBook } from '@/data/books';
import {
  ClockIllustration, GtdFlowIllustration, PomodoroFlowIllustration,
  EisenhowerMatrix, EnergyCurveIllustration,
} from '@/components/illustrations';
import { Badge } from '@/components/ui/Badge';

export function generateStaticParams() {
  return methods.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getMethod(slug);
  if (!m) return { title: '方法未找到' };
  return { title: `${m.name} — 时间管理方法`, description: m.summary, keywords: [m.name, m.enName, '时间管理'] };
}

function MethodIllustration({ slug }: { slug: string }) {
  switch (slug) {
    case 'gtd': return <GtdFlowIllustration className="px-2" />;
    case 'pomodoro': return <PomodoroFlowIllustration />;
    case 'eisenhower': return <EisenhowerMatrix />;
    case 'attention-management':
    case 'full-engagement': return <EnergyCurveIllustration />;
    default: return <ClockIllustration className="mx-auto max-w-[220px]" />;
  }
}

export default async function MethodDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMethod(slug);
  if (!m) notFound();

  const relatedBooks = m.relatedBooks.map(getBook).filter(Boolean);

  return (
    <>
      <section className="border-b border-paper-200 bg-paper-100/60 paper-texture">
        <div className="container-site py-12 sm:py-16">
          <Link href="/methods" className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-caramel-600">
            <ArrowLeft className="h-4 w-4" /> 返回方法库
          </Link>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="eyebrow mb-3">Method · {m.enName}</p>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">{m.name}</h1>
              <p className="mt-5 font-serif text-xl leading-relaxed text-caramel-600">{m.oneLiner}</p>
              <p className="mt-5 max-w-2xl text-sm leading-[1.9] text-ink-soft">{m.summary}</p>
            </div>
            <div className="card-base flex items-center justify-center p-8">
              <MethodIllustration slug={m.slug} />
            </div>
          </div>
        </div>
      </section>

      <div className="container-site grid gap-10 py-14 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-12">
          <section>
            <h2 className="section-title mb-6 text-xl sm:text-2xl">适用场景</h2>
            <div className="flex flex-wrap gap-2">
              {m.suitableFor.map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-forest-soft px-4 py-2 text-sm text-forest">
                  <Users className="h-3.5 w-3.5" /> {s}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="section-title mb-6 text-xl sm:text-2xl">操作步骤</h2>
            <ol className="space-y-4">
              {m.steps.map((step, i) => (
                <li key={step.title} className="card-base flex gap-4 p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-sm font-bold text-paper-50">{i + 1}</span>
                  <div>
                    <h3 className="font-serif text-base font-bold text-ink">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="section-title mb-6 text-xl sm:text-2xl">实践案例</h2>
            <div className="card-base border-l-4 border-caramel-400 bg-caramel-50/50 p-6">
              <p className="flex items-start gap-3 text-sm leading-[1.9] text-ink-soft">
                <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-caramel-500" />
                {m.example}
              </p>
            </div>
          </section>

          <section>
            <h2 className="section-title mb-6 text-xl sm:text-2xl">常见错误与解决方案</h2>
            <div className="space-y-3">
              {m.commonMistakes.map((cm) => (
                <div key={cm.mistake} className="rounded-card border border-paper-300 bg-paper-50 p-5">
                  <p className="flex items-start gap-2 text-sm font-medium text-ink">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-clay" /> {cm.mistake}
                  </p>
                  <p className="mt-2 flex items-start gap-2 pl-6 text-sm leading-relaxed text-ink-muted">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forest" /> {cm.fix}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="card-base p-6">
            <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-ink">
              <BookOpen className="h-5 w-5 text-caramel-500" /> 相关书籍
            </h3>
            <div className="space-y-3">
              {relatedBooks.length > 0 ? relatedBooks.map((b) => (
                <Link key={b!.slug} href={`/books/${b!.slug}`} className="group block border-b border-paper-200 pb-3 last:border-0">
                  <p className="font-serif text-sm font-bold text-ink group-hover:text-caramel-600">{b!.title}</p>
                  <p className="text-xs text-ink-muted">{b!.author}</p>
                </Link>
              )) : <p className="text-sm text-ink-faint">暂无关联书籍。</p>}
            </div>
          </div>

          <div className="rounded-card bg-forest p-6 text-paper-50">
            <h3 className="font-serif text-lg font-bold">想亲手实践？</h3>
            <p className="mt-2 text-sm leading-relaxed text-paper-200">
              到时间实验室，用真实工具把方法变成日常习惯。数据只保存在你的浏览器。
            </p>
            <Link href="/lab" className="mt-5 inline-flex items-center gap-2 rounded-full bg-paper-50 px-5 py-2.5 text-sm font-semibold text-forest hover:bg-paper-100">
              进入时间实验室 →
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
