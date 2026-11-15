'use client';

import { useEffect, useMemo, useState } from 'react';
import { Sparkles, Info, RotateCcw } from 'lucide-react';
import { EChart, CHART_PALETTE } from '@/components/charts/EChart';
import { loadLocal, saveLocal } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface DayRow { day: string; planned: number; actual: number; deep: number; study: number; exercise: number; distraction: number }
interface ReviewData { rows: DayRow[]; achievements: string; problems: string }

const DEFAULT_ROWS: DayRow[] = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day) => ({
  day, planned: 0, actual: 0, deep: 0, study: 0, exercise: 0, distraction: 0,
}));
const KEY = 'lab-weekly-review';

export function WeeklyReview() {
  const [data, setData] = useState<ReviewData>({ rows: DEFAULT_ROWS, achievements: '', problems: '' });
  const [hydrated, setHydrated] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    const saved = loadLocal<ReviewData | null>(KEY, null);
    if (saved && Array.isArray(saved.rows)) setData(saved);
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) saveLocal(KEY, data); }, [data, hydrated]);

  const updateRow = (i: number, patch: Partial<DayRow>) =>
    setData((d) => ({ ...d, rows: d.rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) }));

  const DEMO_ROWS: DayRow[] = [
    { day: '周一', planned: 9, actual: 10, deep: 3, study: 1, exercise: 1, distraction: 2 },
    { day: '周二', planned: 9, actual: 8, deep: 2, study: 1, exercise: 0, distraction: 1.5 },
    { day: '周三', planned: 8, actual: 11, deep: 1, study: 0.5, exercise: 0, distraction: 3.5 },
    { day: '周四', planned: 9, actual: 9, deep: 3, study: 1, exercise: 1, distraction: 1 },
    { day: '周五', planned: 8, actual: 7, deep: 2, study: 0.5, exercise: 0.5, distraction: 1 },
    { day: '周六', planned: 5, actual: 6, deep: 0.5, study: 2, exercise: 2, distraction: 1 },
    { day: '周日', planned: 5, actual: 4, deep: 0, study: 1, exercise: 1, distraction: 1 },
  ];
  const hasReal = data.rows.some((r) => r.planned > 0 || r.actual > 0);
  const rows = showDemo && !hasReal ? DEMO_ROWS : data.rows;

  const compareOption = useMemo(() => ({
    tooltip: { trigger: 'axis' as const, valueFormatter: (v: number) => `${v} 小时` },
    legend: { data: ['计划', '实际'], bottom: 0, textStyle: { color: '#7A736A', fontSize: 11 } },
    grid: { left: 40, right: 16, top: 24, bottom: 44 },
    xAxis: { type: 'category' as const, data: rows.map((r) => r.day), axisLabel: { color: '#7A736A', fontSize: 11 }, axisLine: { lineStyle: { color: '#DED2BE' } } },
    yAxis: { type: 'value' as const, name: '小时', nameTextStyle: { color: '#A9A297', fontSize: 10 }, splitLine: { lineStyle: { color: '#F3EEE3' } } },
    series: [
      { name: '计划', type: 'bar' as const, data: rows.map((r) => r.planned), barWidth: '30%', itemStyle: { color: '#DED2BE', borderRadius: [5, 5, 0, 0] } },
      { name: '实际', type: 'bar' as const, data: rows.map((r) => r.actual), barWidth: '30%', itemStyle: { color: '#C67C4B', borderRadius: [5, 5, 0, 0] } },
    ],
  }), [rows]);

  const trendOption = useMemo(() => ({
    tooltip: { trigger: 'axis' as const, valueFormatter: (v: number) => `${v} 小时` },
    legend: { data: ['深度工作', '学习', '运动', '分心消耗'], bottom: 0, textStyle: { color: '#7A736A', fontSize: 11 } },
    grid: { left: 40, right: 16, top: 24, bottom: 44 },
    xAxis: { type: 'category' as const, boundaryGap: false, data: rows.map((r) => r.day), axisLabel: { color: '#7A736A', fontSize: 11 }, axisLine: { lineStyle: { color: '#DED2BE' } } },
    yAxis: { type: 'value' as const, name: '小时', nameTextStyle: { color: '#A9A297', fontSize: 10 }, splitLine: { lineStyle: { color: '#F3EEE3' } } },
    series: [
      { name: '深度工作', type: 'line' as const, smooth: true, data: rows.map((r) => r.deep), lineStyle: { color: CHART_PALETTE[0], width: 2.5 }, itemStyle: { color: CHART_PALETTE[0] } },
      { name: '学习', type: 'line' as const, smooth: true, data: rows.map((r) => r.study), lineStyle: { color: CHART_PALETTE[4], width: 2.5 }, itemStyle: { color: CHART_PALETTE[4] } },
      { name: '运动', type: 'line' as const, smooth: true, data: rows.map((r) => r.exercise), lineStyle: { color: CHART_PALETTE[1], width: 2.5 }, itemStyle: { color: CHART_PALETTE[1] } },
      { name: '分心消耗', type: 'line' as const, smooth: true, data: rows.map((r) => r.distraction), lineStyle: { color: '#B5651D', width: 2, type: 'dashed' as const }, itemStyle: { color: '#B5651D' } },
    ],
  }), [rows]);

  const analytics = useMemo(() => {
    const totalPlan = rows.reduce((s, r) => s + r.planned, 0);
    const totalActual = rows.reduce((s, r) => s + r.actual, 0);
    const totalDeep = rows.reduce((s, r) => s + r.deep, 0);
    const totalDistraction = rows.reduce((s, r) => s + r.distraction, 0);
    const maxDrain = [...rows].sort((a, b) => b.distraction - a.distraction)[0];
    const actions: string[] = [];
    if (totalDistraction > 0) actions.push(`本周分心消耗合计约 ${totalDistraction.toFixed(1)} 小时，其中${maxDrain.day}最高（${maxDrain.distraction} 小时）。下周可为该日预设一个"低刺激时段"。`);
    if (totalPlan > 0 && totalActual > totalPlan * 1.1) actions.push('实际投入时长明显高于计划，注意是否为"忙碌陷阱"，用产出而非时长衡量每天。');
    if (totalPlan > 0 && totalActual < totalPlan * 0.8) actions.push('实际时长明显低于计划，可能有较多任务被推迟。下周试着把要事安排进具体时段。');
    if (totalDeep < 5) actions.push(`本周深度工作约 ${totalDeep.toFixed(1)} 小时。下周可尝试每天保住一个 90 分钟不受打扰的深度时段。`);
    if (!actions.length) actions.push('本周节奏较平稳。可以挑一天做一次更细的时间审计，寻找进一步优化空间。');
    return { totalPlan, totalActual, totalDeep, totalDistraction, actions };
  }, [rows]);

  return (
    <div className="space-y-6">
      <div className="card-base p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-lg font-bold text-ink">本周时间记录</h2>
            <p className="mt-1 text-xs text-ink-muted">按小时填写，留空视为 0。数据保存在本地浏览器。</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-ink-muted">
              <input type="checkbox" checked={showDemo} onChange={(e) => setShowDemo(e.target.checked)} className="accent-caramel-500" />
              演示数据
            </label>
            <button onClick={() => setData({ rows: DEFAULT_ROWS, achievements: '', problems: '' })} className="inline-flex items-center gap-1 text-xs text-ink-muted hover:text-caramel-600"><RotateCcw className="h-3.5 w-3.5" /> 清空</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-paper-300 text-left text-xs text-ink-muted">
                <th className="py-2 pr-3 font-medium">日期</th>
                <th className="px-2 py-2 font-medium">计划(h)</th>
                <th className="px-2 py-2 font-medium">实际(h)</th>
                <th className="px-2 py-2 font-medium">深度工作</th>
                <th className="px-2 py-2 font-medium">学习</th>
                <th className="px-2 py-2 font-medium">运动</th>
                <th className="px-2 py-2 font-medium">分心消耗</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.day} className="border-b border-paper-100 last:border-0">
                  <td className="py-1.5 pr-3 font-medium text-ink">{r.day}</td>
                  {(['planned', 'actual', 'deep', 'study', 'exercise', 'distraction'] as const).map((field) => (
                    <td key={field} className="px-2 py-1.5">
                      <input
                        type="number" min={0} max={24} step={0.5} value={r[field] || ''}
                        disabled={showDemo && !hasReal}
                        onChange={(e) => updateRow(i, { [field]: Math.max(0, Math.min(24, Number(e.target.value) || 0)) })}
                        placeholder="0"
                        className={cn('w-full rounded-md border border-paper-300 bg-paper-50 px-2 py-1.5 text-center text-sm tabular-nums', (showDemo && !hasReal) && 'opacity-60')}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-ink-faint">当使用演示数据时，记录以灰色只读显示，非真实数据。</p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card-base p-5 sm:p-6">
          <h3 className="mb-2 font-serif text-lg font-bold text-ink">计划时间与实际时间对比</h3>
          <EChart option={compareOption} height={300} />
        </div>
        <div className="card-base p-5 sm:p-6">
          <h3 className="mb-2 font-serif text-lg font-bold text-ink">一周时间分配趋势</h3>
          <EChart option={trendOption} height={300} />
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { label: '计划合计', value: analytics.totalPlan, tone: 'text-ink' },
          { label: '实际合计', value: analytics.totalActual, tone: 'text-caramel-600' },
          { label: '深度工作', value: analytics.totalDeep, tone: 'text-forest' },
        ].map((s) => (
          <div key={s.label} className="card-base p-5 text-center">
            <p className="text-xs text-ink-muted">{s.label}</p>
            <p className={cn('mt-2 font-serif text-3xl font-bold', s.tone)}>{s.value.toFixed(1)}<span className="ml-1 text-sm font-normal text-ink-faint">小时</span></p>
          </div>
        ))}
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card-base p-6">
          <h3 className="mb-4 font-serif text-lg font-bold text-ink">本周成果与问题</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">本周最有价值的成果</label>
              <textarea value={data.achievements} onChange={(e) => setData((d) => ({ ...d, achievements: e.target.value }))} rows={4} placeholder="例如：完成了方案初稿；保持了每天阅读……" className="w-full resize-y rounded-lg border border-paper-300 bg-paper-50 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">本周遇到的问题</label>
              <textarea value={data.problems} onChange={(e) => setData((d) => ({ ...d, problems: e.target.value }))} rows={4} placeholder="例如：周三被临时会议打断；晚上总是刷手机……" className="w-full resize-y rounded-lg border border-paper-300 bg-paper-50 px-3 py-2.5 text-sm" />
            </div>
          </div>
        </div>

        <div className="card-base border-forest/20 bg-forest-soft/30 p-6">
          <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-ink"><Sparkles className="h-5 w-5 text-forest" /> 下周优化行动</h3>
          <ul className="space-y-3">
            {analytics.actions.map((a, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest font-serif text-xs font-bold text-white">{i + 1}</span>{a}
              </li>
            ))}
          </ul>
          <p className="mt-5 flex items-start gap-2 border-t border-forest/15 pt-4 text-xs text-ink-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            行动建议由规则自动生成，结合你填写的"成果与问题"手动制定具体计划，效果会更好。
          </p>
        </div>
      </div>
    </div>
  );
}
