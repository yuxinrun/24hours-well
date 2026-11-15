import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { SmartImage } from '@/components/ui/SmartImage';
import { ClockIllustration } from '@/components/illustrations';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-paper-200 bg-paper-50">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-caramel-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-forest-soft/60 blur-3xl" />

      <div className="container-site relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:py-28">
        <div className="animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-caramel-200 bg-caramel-50 px-4 py-1.5 text-xs font-medium text-caramel-600">
            <Sparkles className="h-3.5 w-3.5" />
            一个关于时间、精力与生活的知识平台
          </div>

          <h1 className="font-serif text-[2.1rem] font-bold leading-[1.25] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem] lg:leading-[1.2]">
            人生只有 24 小时，
            <br />
            <span className="text-caramel-500">如何把每一天过好？</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-[1.9] text-ink-soft sm:text-lg">
            研究时间、理解精力、管理注意力，把有限的每一分钟，留给真正重要的事情。这里有方法、有书籍、有工具，也有值得慢下来读的思考。
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <ButtonLink href="/lab/24-hours" variant="primary" size="lg">
              探索 24 小时
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/lab/time-audit" variant="outline" size="lg">
              开始时间审计
            </ButtonLink>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs text-ink-muted">
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-caramel-500" /> 14 篇深度文章
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-forest" /> 12 个方法 · 12 本好书
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-caramel-400" /> 5 个交互工具
            </span>
          </div>
        </div>

        <div className="relative animate-fade-up lg:pl-4" style={{ animationDelay: '0.12s' }}>
          <div className="relative mx-auto max-w-lg">
            <SmartImage
              src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1100&q=85&auto=format&fit=crop"
              alt="清晨阳光洒在书桌上的笔记本、书本与咖啡"
              eager
              className="aspect-[4/3] w-full rounded-[24px] shadow-lift sm:aspect-[5/4]"
              imgClassName="transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute -bottom-7 -left-4 hidden h-28 w-28 rounded-2xl border border-paper-300 bg-paper-50 p-3 shadow-soft sm:block">
              <ClockIllustration />
            </div>
            <div className="absolute -right-3 top-6 hidden rounded-xl border border-paper-200 bg-paper-50/95 px-4 py-3 shadow-soft backdrop-blur sm:block">
              <p className="text-[10px] font-medium uppercase tracking-wider text-ink-faint">Slogan</p>
              <p className="mt-0.5 font-serif text-sm font-semibold text-caramel-600">Make Every Hour Count.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
