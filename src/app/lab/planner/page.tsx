import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { DailyPlanner } from '@/components/lab/DailyPlanner';

export const metadata: Metadata = {
  title: '每日计划',
  description: '在 24 小时纵向时间轴上添加任务，设置分类与优先级，自动检测时间冲突，并用 ECharts 甘特图查看一天的安排。',
};

export default function PlannerPage() {
  return (
    <>
      <PageHero
        eyebrow="Tool 03 · Planning"
        title="每日计划"
        description="把重要的事放进具体的时间。添加任务、设置分类与优先级，工具会在时间轴上可视化你的一天，并提醒你注意时间冲突。"
        breadcrumb={[{ label: '时间实验室', href: '/lab' }, { label: '每日计划' }]}
      />
      <div className="container-site py-12">
        <DailyPlanner />
      </div>
    </>
  );
}
