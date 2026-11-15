import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { WeeklyReview } from '@/components/lab/WeeklyReview';

export const metadata: Metadata = {
  title: '每周复盘',
  description: '对比计划与实际时间，展示一周时间分配趋势，分析主要时间消耗，记录成果与问题，生成下周优化行动。',
};

export default function WeeklyReviewPage() {
  return (
    <>
      <PageHero
        eyebrow="Tool 04 · Review"
        title="每周复盘"
        description="复盘是一周中最有价值的 45 分钟。对比计划与实际，看见时间的真实去向，记录成果与问题，为下周生成可执行的优化行动。"
        breadcrumb={[{ label: '时间实验室', href: '/lab' }, { label: '每周复盘' }]}
      />
      <div className="container-site py-12">
        <WeeklyReview />
      </div>
    </>
  );
}
