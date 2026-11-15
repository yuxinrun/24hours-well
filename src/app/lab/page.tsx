import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { FocusTimer } from '@/components/lab/FocusTimer';
import { Clock3, ClipboardList, CalendarRange, ChartNoAxesCombined, Timer, ArrowRight, LockKeyhole } from 'lucide-react';

export const metadata: Metadata = {
  title: '时间实验室',
  description: '24 小时分配器、时间审计、每日计划、每周复盘、专注计时器——把时间管理方法变成可操作的日常实践，数据仅保存在本地浏览器。',
};

const tools = [
  { href: '/lab/24-hours', title: '24 小时分配器', desc: '用环形图规划睡眠、工作、学习、运动等时间分配，实时计算总计。', icon: Clock3, color: '#C67C4B' },
  { href: '/lab/time-audit', title: '时间审计', desc: '记录过去一天的真实时间使用，自动统计浪费与投入，找出改善区间。', icon: ClipboardList, color: '#33513F' },
  { href: '/lab/planner', title: '每日计划', desc: '在 24 小时纵向时间轴上添加任务，设置分类与优先级，检测时间冲突。', icon: CalendarRange, color: '#A8623C' },
  { href: '/lab/weekly-review', title: '每周复盘', desc: '对比计划与实际时间，分析主要消耗，记录成果与问题，生成下周行动。', icon: ChartNoAxesCombined, color: '#4F6E58' },
];

export default function LabPage() {
  return (
    <>
      <PageHero
        eyebrow="The Time Lab"
        title="时间实验室"
        description="读过的道理，只有亲手用过才算真正拥有。这里的工具把方法变成可操作的实践。所有个人数据默认只保存在你的浏览器，不会上传。"
        breadcrumb={[{ label: '时间实验室' }]}
      />

      <div className="container-site py-12">
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-forest/20 bg-forest-soft/50 p-4 text-sm text-forest">
          <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
          <p>隐私说明：本实验室所有记录均通过浏览器 localStorage 保存在你自己的设备上，刷新后可继续读取。本站不会收集或上传你的个人时间数据。</p>
        </div>

        <SectionHeading eyebrow="Tools" title="选择一个工具开始" description="从看清时间去向，到规划、执行与复盘。" />
        <div className="grid gap-5 sm:grid-cols-2">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <Link key={t.href} href={t.href} className="card-base card-hover group flex gap-5 p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: `${t.color}18`, color: t.color }}>
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-bold text-ink group-hover:text-caramel-600">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{t.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-caramel-500">打开工具 <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <section id="focus" className="scroll-mt-24 border-y border-paper-200 bg-paper-100/60 py-14">
        <div className="container-site">
          <div className="mb-8 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-caramel-100 text-caramel-600"><Timer className="h-5 w-5" /></span>
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink">专注计时器</h2>
              <p className="text-sm text-ink-muted">番茄工作法 · 开始、暂停、重置 · 记录每一次专注</p>
            </div>
          </div>
          <FocusTimer />
        </div>
      </section>
    </>
  );
}
