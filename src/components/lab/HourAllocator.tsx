'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, RotateCcw, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { EChart, CHART_PALETTE } from '@/components/charts/EChart';
import { loadLocal, saveLocal } from '@/lib/storage';
import { formatMinutes } from '@/lib/utils';
import type { TimeCategory } from '@/lib/types';

const DEFAULT: TimeCategory[] = [
  { id: 'sleep', label: '睡眠', minutes: 480, color: CHART_PALETTE[1] },
  { id: 'work', label: '工作', minutes: 480, color: CHART_PALETTE[0] },
  { id: 'study', label: '学习', minutes: 120, color: CHART_PALETTE[2] },
  { id: 'exercise', label: '运动', minutes: 60, color: CHART_PALETTE[4] },
  { id: 'commute', label: '通勤', minutes: 60, color: CHART_PALETTE[5] },
  { id: 'meal', label: '饮食', minutes: 90, color: CHART_PALETTE[3] },
  { id: 'leisure', label: '休闲', minutes: 150, color: CHART_PALETTE[6] },
];

const KEY = 'lab-24hours';

export function HourAllocator() {
  const [items, setItems] = useState<TimeCategory[]>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadLocal<TimeCategory[] | null>(KEY, null);
    if (saved && Array.isArray(saved) && saved.length) setItems(saved);
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) saveLocal(KEY, items);
  }, [items, hydrated]);

  const total = items.reduce((s, i) => s + i.minutes, 0);
  const remaining = 1440 - total;
  const valid = remaining === 0;

  const update = (id: string, patch: Partial<TimeCategory>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const remove = (id: string) => setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));
  const add = () => setItems((prev) => [...prev, {
    id: `custom-${Date.now()}`,
    label: '新类别',
    minutes: 0,
    color: CHART_PALETTE[prev.length % CHART_PALETTE.length],
  }]);

  const option = useMemo(() => ({
    tooltip: {
      trigger: 'item' as const,
      formatter: (p: { name: string; value: number; percent: number }) => `${p.name}：${formatMinutes(Number(p.value))}（${p.percent}%）`,
    },
    legend: {
      type: 'scroll' as const,
      orient: 'horizontal' as const,
      bottom: 0,
      itemWidth: 10, itemHeight: 10, itemGap: 14,
      textStyle: { color: '#7A736A', fontSize: 11 },
    },
    title: {
      text: `${(total / 60).toFixed(1)}h`,
      subtext: valid ? '已分配 / 24h' : `剩余 ${formatMinutes(Math.abs(remaining))}`,
      left: 'center' as const, top: '40%',
      textStyle: { fontFamily: 'serif', fontSize: 32, color: '#2A2724', fontWeight: 700 },
      subtextStyle: { fontSize: 12, color: valid ? '#33513F' : '#C67C4B', lineHeight: 22 },
    },
    series: [{
      type: 'pie' as const,
      radius: ['55%', '78%'],
      center: ['50%', '46%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#FDFBF7', borderWidth: 3 },
      label: { show: false },
      data: items.filter((i) => i.minutes > 0).map((i) => ({ value: i.minutes, name: i.label, itemStyle: { color: i.color } })),
    }],
  }), [items, total, remaining, valid]);

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="card-base flex min-w-0 flex-col p-5 sm:p-7">
        <EChart option={option} height={360} />
        <div className={`mt-4 rounded-xl px-4 py-4 text-center text-sm ${
          valid ? 'bg-forest-soft text-forest' : remaining < 0 ? 'bg-caramel-50 text-caramel-600' : 'bg-paper-100 text-ink-muted'
        }`}>
          {valid ? (
            <span className="inline-flex items-center gap-2 font-medium"><CheckCircle2 className="h-4 w-4" /> 完美：已分配 24 小时，没有剩余或超出。</span>
          ) : remaining < 0 ? (
            <span className="inline-flex items-center gap-2 font-medium"><AlertTriangle className="h-4 w-4" /> 已超出 24 小时 {formatMinutes(-remaining)}，请减少某些类别。</span>
          ) : (
            <span>还有 <strong className="font-serif text-base">{formatMinutes(remaining)}</strong> 未被安排。想想它去了哪里，或增加一个新类别。</span>
          )}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-paper-100 p-3"><p className="font-serif text-lg font-bold text-ink">{(total / 60).toFixed(1)}h</p><p className="text-[11px] text-ink-faint">已分配</p></div>
          <div className="rounded-lg bg-paper-100 p-3"><p className="font-serif text-lg font-bold text-ink">{items.length}</p><p className="text-[11px] text-ink-faint">类别数</p></div>
          <div className="rounded-lg bg-paper-100 p-3"><p className="font-serif text-lg font-bold text-ink">{Math.round((total / 1440) * 100)}%</p><p className="text-[11px] text-ink-faint">占比</p></div>
        </div>
      </div>

      <div className="card-base min-w-0 p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-ink">编辑时间类别</h2>
          <button onClick={() => setItems(DEFAULT)} className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-caramel-600">
            <RotateCcw className="h-3.5 w-3.5" /> 重置
          </button>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-lg border border-paper-200 bg-paper-50 p-2.5">
              <input type="color" value={item.color} onChange={(e) => update(item.id, { color: e.target.value })} className="h-8 w-8 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0" aria-label="选择颜色" />
              <input
                type="text" value={item.label}
                onChange={(e) => update(item.id, { label: e.target.value.slice(0, 12) })}
                className="min-w-0 flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm text-ink hover:border-paper-300 focus:border-caramel-300 focus:outline-none"
                aria-label="类别名称"
              />
              <div className="flex shrink-0 items-center gap-1">
                <input
                  type="number" min={0} max={1440} value={item.minutes}
                  onChange={(e) => update(item.id, { minutes: Math.max(0, Math.min(1440, Number(e.target.value) || 0)) })}
                  className="w-16 rounded-md border border-paper-300 bg-paper-50 px-2 py-1.5 text-center text-sm tabular-nums"
                  aria-label="分钟数"
                />
                <span className="text-xs text-ink-faint">分</span>
              </div>
              <button onClick={() => remove(item.id)} disabled={items.length <= 1} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-faint hover:bg-caramel-50 hover:text-caramel-600 disabled:opacity-30" aria-label={`删除${item.label}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button onClick={add} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-paper-300 py-3 text-sm font-medium text-ink-muted hover:border-caramel-400 hover:text-caramel-600">
          <Plus className="h-4 w-4" /> 添加新类别
        </button>

        <div className="mt-6 rounded-xl bg-paper-100 p-4">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-caramel-500" />
            <span>
              <strong className="text-ink-soft">关于分配建议：</strong>成年人通常需要约 7 小时以上睡眠（来源：CDC 睡眠健康建议），工作、学习与休闲的比例则因人而异。这里没有"标准答案"，请把建议当作起点，根据自己的精力节律与生活责任调整。
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
