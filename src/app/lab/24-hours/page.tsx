import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { HourAllocator } from '@/components/lab/HourAllocator';

export const metadata: Metadata = {
  title: '24 小时分配器',
  description: '用 ECharts 环形图可视化并编辑你的一天：睡眠、工作、学习、运动、通勤、饮食、休闲，实时计算是否等于 24 小时。',
};

export default function TwentyFourHoursPage() {
  return (
    <>
      <PageHero
        eyebrow="Tool 01 · Allocation"
        title="24 小时分配器"
        description="一天只有 24 小时。把你认为重要的活动分配进去，看看时间究竟去了哪里。你可以增加、修改、删除类别，图表会实时更新，数据保存在本地浏览器。"
        breadcrumb={[{ label: '时间实验室', href: '/lab' }, { label: '24 小时分配器' }]}
      />
      <div className="container-site py-12">
        <HourAllocator />
      </div>
    </>
  );
}
