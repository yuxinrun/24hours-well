import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { TimeAudit } from '@/components/lab/TimeAudit';

export const metadata: Metadata = {
  title: '时间审计',
  description: '记录过去一天的真实时间使用，自动统计投入与浪费，用图表展示时间分布，生成可执行的优化建议。',
};

export default function TimeAuditPage() {
  return (
    <>
      <PageHero
        eyebrow="Tool 02 · Audit"
        title="时间审计"
        description="诚实地记录，是改变的第一步。填写过去一天的真实活动与起止时间，工具会自动统计时间投入与消耗，帮你找到可以改善的区间。"
        breadcrumb={[{ label: '时间实验室', href: '/lab' }, { label: '时间审计' }]}
      />
      <div className="container-site py-12">
        <TimeAudit />
      </div>
    </>
  );
}
