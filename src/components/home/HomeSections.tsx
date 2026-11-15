import Link from 'next/link';
import {
  ArrowRight, Quote, Lightbulb, Timer, Clock3,
  ClipboardList, CalendarRange, ChartNoAxesCombined, Hourglass,
} from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { SmartImage } from '@/components/ui/SmartImage';
import { ArticleCard, MethodCard, BookCard, WebsiteCard } from '@/components/content/Cards';
import { DayJourneyIllustration } from '@/components/illustrations';
import { getAllArticles } from '@/lib/articles';
import { methods } from '@/data/methods';
import { books } from '@/data/books';
import { websites } from '@/data/websites';

/** 今日时间灵感 */
export function InspirationSection() {
  const feature = getAllArticles().find((a) => a.featured) ?? getAllArticles()[0];
  if (!feature) return null;

  return (
    <section className="container-site py-16 sm:py-20">
      <SectionHeading eyebrow="Daily Inspiration" title="今日时间灵感" description="一篇文章、一句话、一个行动——今天从这里开始。" />
      <div className="grid gap-5 lg:grid-cols-3">
        <Link href={`/articles/${feature.slug}`} className="card-base card-hover group overflow-hidden lg:col-span-1">
          <SmartImage src={feature.cover} alt={feature.coverAlt} className="aspect-[16/10] w-full" imgClassName="transition-transform duration-500 group-hover:scale-105" />
          <div className="p-5">
            <Badge tone="caramel">精选深读 · {feature.readMinutes} 分钟</Badge>
            <h3 className="mt-3 font-serif text-lg font-bold leading-snug text-ink group-hover:text-caramel-600">{feature.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{feature.excerpt}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-caramel-500">阅读全文 <ArrowRight className="h-3.5 w-3.5" /></span>
          </div>
        </Link>

        <div className="card-base flex flex-col justify-between bg-paper-100/80 p-6 sm:p-7">
          <div>
            <Quote className="h-7 w-7 text-caramel-300" />
            <blockquote className="mt-4 font-serif text-xl leading-relaxed text-ink sm:text-2xl">
              &ldquo;并非我们的生命短暂，而是我们浪费了太多时间。&rdquo;
            </blockquote>
          </div>
          <div className="mt-6 border-t border-paper-300 pt-4 text-xs text-ink-muted">
            <p className="font-medium text-ink-soft">—— 塞内卡（Seneca）</p>
            <p>古罗马哲学家，《论生命之短暂》（De Brevitate Vitae）</p>
          </div>
        </div>

        <div className="card-base flex flex-col justify-between border-forest/20 bg-forest-soft/40 p-6 sm:p-7">
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest text-white"><Lightbulb className="h-5 w-5" /></span>
            <h3 className="mt-4 font-serif text-lg font-bold text-ink">一个今天就能做的小行动</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              今天，为一件你一直想做却总被推迟的事，预留 <strong className="text-forest">25 分钟</strong>。关掉通知，只做第一步。开始的那一刻，就已经改变了。
            </p>
          </div>
          <Link href="/methods/pomodoro" className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:underline">
            了解番茄工作法 <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** 时间管理方法 */
export function MethodsSection() {
  return (
    <section className="border-y border-paper-200 bg-paper-100/50 py-16 sm:py-20">
      <div className="container-site">
        <SectionHeading
          eyebrow="Methods & Frameworks"
          title="被验证的时间管理方法"
          description="从 GTD 到深度工作，从番茄工作法到艾森豪威尔矩阵——找到适合你的那一套。"
          href="/methods"
          linkText="浏览全部方法"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {methods.slice(0, 6).map((m) => <MethodCard key={m.slug} method={m} />)}
        </div>
        <div className="mt-6 text-center">
          <Link href="/methods" className="btn-outline">查看全部 12 个方法 <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}

/** 深度阅读 */
export function FeaturedArticlesSection() {
  const articles = getAllArticles().slice(0, 6);
  return (
    <section className="container-site py-16 sm:py-20">
      <SectionHeading
        eyebrow="Deep Reading"
        title="值得慢下来读的文章"
        description="不是碎片化的技巧，而是有结构、有依据、能落地的深度思考。"
        href="/articles"
        linkText="进入文章中心"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => <ArticleCard key={a.slug} article={a} />)}
      </div>
    </section>
  );
}

/** 一天流转插画带 */
export function DayJourneySection() {
  return (
    <section className="container-site pb-4 pt-2">
      <div className="card-base paper-texture px-6 py-8 sm:px-10">
        <div className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-ink-faint">
          <Clock3 className="h-4 w-4 text-caramel-500" /> A Day, Well Lived
        </div>
        <DayJourneyIllustration />
        <p className="mt-6 text-center font-serif text-sm text-ink-muted">从清晨到深夜，每一个时段都有它值得被好好度过的方式。</p>
      </div>
    </section>
  );
}

/** 全球经典好书 */
export function BooksSection() {
  return (
    <section className="container-site py-16 sm:py-20">
      <SectionHeading
        eyebrow="The Reading Shelf"
        title="全球经典好书"
        description="关于时间、习惯、注意力与人生的必读书目，信息以公开出版资料为准。"
        href="/books"
        linkText="浏览书单"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {books.slice(0, 4).map((b) => <BookCard key={b.slug} book={b} />)}
      </div>
    </section>
  );
}

/** 全球优质网站 */
export function WebsitesSection() {
  const cats = Array.from(new Set(websites.map((w) => w.category))).slice(0, 4);
  const picks = cats.map((c) => websites.find((w) => w.category === c)!).filter(Boolean);
  return (
    <section className="border-y border-paper-200 bg-paper-100/50 py-16 sm:py-20">
      <div className="container-site">
        <SectionHeading
          eyebrow="Curated Web"
          title="全球优质网站"
          description="经过筛选的真实网站，按时间管理、效率、心理学、睡眠、知识管理等分类整理。"
          href="/websites"
          linkText="查看全部网站"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {picks.map((w) => <WebsiteCard key={w.slug} site={w} />)}
        </div>
      </div>
    </section>
  );
}

/** 时间实验室入口 */
const tools = [
  { href: '/lab/24-hours', title: '24 小时分配器', desc: '可视化你的一天', icon: Clock3, tone: 'bg-caramel-100 text-caramel-600' },
  { href: '/lab/time-audit', title: '时间审计', desc: '看清时间去哪了', icon: ClipboardList, tone: 'bg-forest-soft text-forest' },
  { href: '/lab/planner', title: '每日计划', desc: '在时间轴上安排任务', icon: CalendarRange, tone: 'bg-caramel-100 text-caramel-600' },
  { href: '/lab/weekly-review', title: '每周复盘', desc: '计划与实际的对话', icon: ChartNoAxesCombined, tone: 'bg-forest-soft text-forest' },
  { href: '/lab#focus', title: '专注计时器', desc: '番茄式专注练习', icon: Timer, tone: 'bg-caramel-100 text-caramel-600' },
];

export function LabSection() {
  return (
    <section className="container-site py-16 sm:py-20">
      <SectionHeading
        eyebrow="The Time Lab"
        title="时间实验室"
        description="不只是读，更要动手。这些工具把方法变成你的日常实践，数据默认只保存在你的浏览器。"
        href="/lab"
        linkText="进入实验室"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.href} href={t.href} className="card-base card-hover group flex items-center gap-4 p-5">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${t.tone}`}>
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div className="flex-1">
                <h3 className="font-serif text-base font-bold text-ink group-hover:text-caramel-600">{t.title}</h3>
                <p className="mt-0.5 text-xs text-ink-muted">{t.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-faint transition-transform group-hover:translate-x-1 group-hover:text-caramel-500" />
            </Link>
          );
        })}
        <div className="card-base flex items-center gap-4 border-dashed bg-paper-100/60 p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-paper-200 text-ink-muted"><Hourglass className="h-5 w-5" /></span>
          <div>
            <h3 className="font-serif text-base font-bold text-ink-soft">更多工具，持续更新</h3>
            <p className="mt-0.5 text-xs text-ink-muted">目标是让方法真正可用</p>
          </div>
        </div>
      </div>
    </section>
  );
}
