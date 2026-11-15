'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, RotateCcw, ArrowRight, Info } from 'lucide-react';
import { EChart, CHART_PALETTE } from '@/components/charts/EChart';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { loadLocal, saveLocal } from '@/lib/storage';
import { formatMinutes } from '@/lib/utils';
import type { TimeCategory } from '@/lib/types';

const DEFAULT_CATEGORIES: TimeCategory[] = [
  { id: 'sleep', label: '睡眠', minutes: 480, color: CHART_PALETTE[1] },
  { id: 'work', label: '工作', minutes: 540, color: CHART_PALETTE[0] },
  { id: 'study', label: '学习', minutes: 90, color: CHART_PALETTE[2] },
  { id: 'exercise', label: '运动', minutes: 60, color: CHART_PALETTE[4] },
  { id: 'commute', label: '通勤', minutes: 60, color: CHART_PALETTE[5] },
  { id: 'meal', label: '饮食', minutes: 90, color: CHART_PALETTE[3] },
  { id: 'leisure', label: '休闲', minutes: 120, color: CHART_PALETTE[6] },
];

const STORAGE_KEY = 'home-time-ring';

export function TimeRingSection() {
  const [categories, setCategories] = useState<TimeCategory[]>(DEFAULT_CATEGORIES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadLocal<TimeCategory[] | null>(STORAGE_KEY, null);
    if (saved && Array.isArray(saved) && saved.length) setCategories(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveLocal(STORAGE_KEY, categories);
  }, [categories, hydrated]);

  const total = categories.reduce((sum, c) => sum + c.minutes, 0);
  const diff = total - 1440;
  const balanced = diff === 0;

  const change = (id: string, delta: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, minutes: Math.max(0, Math.min(1440, c.minutes + delta)) } : c))
    );
  };

  const option = useMemo(
    () => ({
      tooltip: {
        trigger: 'item' as const,
        formatter: (p: { name: string; value: number; percent: number }) =>
          `${p.name}：${formatMinutes(p.value)}（${p.percent}%）`,
      },
      title: {
        text: `${(total / 60).toFixed(1)}h`,
        subtext: balanced ? '已分配 / 24h' : `偏差 ${diff > 0 ? '+' : ''}${(diff / 60).toFixed(1)}h`,
        left: 'center' as const,
        top: '38%',
        textStyle: { fontFamily: 'serif', fontSize: 30, color: '#2A2724', fontWeight: 700 },
        subtextStyle: { fontSize: 12, color: balanced ? '#33513F' : '#C67C4B', lineHeight: 22 },
      },
      series: [
        {
          type: 'pie' as const,
          radius: ['62%', '86%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 6, borderColor: '#FDFBF7', borderWidth: 3 },
          label: { show: false },
          emphasis: { scale: true, scaleSize: 5 },
          data: categories.map((c) => ({ value: c.minutes, name: c.label, itemStyle: { color: c.color } })),
        },
      ],
    }),
    [categories, total, diff, balanced]
  );

  return (
    <section className="border-y border-paper-200 bg-paper-100/60 py-16 sm:py-20">
      <div className="container-site">
        <SectionHeading
          eyebrow="Every Single Day"
          title="每天 24 小时，你去哪里了？"
          description="试着调整下面各类活动的时长，看看你的时间去了哪里。图表与数据会实时更新，并保存在你的浏览器里。"
          href="/lab/24-hours"
          linkText="打开完整分配器"
        />

        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="card-base flex min-w-0 flex-col items-center justify-center p-5 sm:p-7">
            <EChart option={option} height={300} />
            <div
              className={`mt-2 w-full rounded-lg px-4 py-3 text-center text-sm ${
                balanced ? 'bg-forest-soft text-forest' : 'bg-caramel-50 text-caramel-600'
              }`}
            >
              {balanced ? (
                <span>✓ 时间分配正好等于 24 小时，这是一个完整的闭环。</span>
              ) : (
                <span>
                  {diff > 0
                    ? `已超出 24 小时 ${formatMinutes(diff)}，试着减少一些项目。`
                    : `还有 ${formatMinutes(-diff)} 未被安排，想想它去了哪里。`}
                </span>
              )}
            </div>
          </div>

          <div className="card-base min-w-0 p-5 sm:p-7">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold">调整你的时间分配</h3>
              <button
                onClick={() => setCategories(DEFAULT_CATEGORIES)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-caramel-600"
              >
                <RotateCcw className="h-3.5 w-3.5" /> 重置
              </button>
            </div>
            <ul className="space-y-1">
              {categories.map((c) => (
                <li key={c.id} className="flex items-center gap-3 border-b border-paper-200 py-2.5 last:border-0">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: c.color }} />
                  <span className="min-w-0 flex-1 truncate text-sm text-ink-soft">{c.label}</span>
                  <span className="w-20 shrink-0 text-right font-serif text-sm font-semibold tabular-nums text-ink">
                    {formatMinutes(c.minutes)}
                  </span>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => change(c.id, -15)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-paper-300 text-ink-muted transition-colors hover:border-caramel-400 hover:text-caramel-600"
                      aria-label={`减少${c.label}15分钟`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => change(c.id, 15)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-paper-300 text-ink-muted transition-colors hover:border-caramel-400 hover:text-caramel-600"
                      aria-label={`增加${c.label}15分钟`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-lg bg-paper-100 p-3 text-xs leading-relaxed text-ink-muted">
              <p className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-caramel-500" />
                <span>
                  这里展示的是一份<strong className="text-ink-soft">常见的参考分配</strong>，不是科学定论。理想的分配因人而异，请根据自己的精力节律与生活责任调整。想深入实践，可前往
                  <Link href="/lab/24-hours" className="mx-1 font-medium text-caramel-600 hover:underline">
                    24 小时分配器
                  </Link>
                  。
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
