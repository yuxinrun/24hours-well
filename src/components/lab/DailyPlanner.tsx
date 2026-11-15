'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, AlertTriangle, Check, Clock3, BarChart3, Info } from 'lucide-react';
import { EChart } from '@/components/charts/EChart';
import { loadLocal, saveLocal } from '@/lib/storage';
import { cn, formatClock, formatMinutes, parseClock } from '@/lib/utils';

type Priority = 'high' | 'medium' | 'low';
interface Task { id: string; title: string; category: string; priority: Priority; start: string; end: string; done: boolean }

const CATEGORIES = ['深度工作', '会议协作', '学习', '运动', '生活事务', '休息', '其他'];
const PRIORITY: Record<Priority, { label: string; color: string; badge: string }> = {
  high: { label: '高', color: '#C67C4B', badge: 'bg-caramel-100 text-caramel-600' },
  medium: { label: '中', color: '#33513F', badge: 'bg-forest-soft text-forest' },
  low: { label: '低', color: '#8A4E2F', badge: 'bg-paper-200 text-ink-muted' },
};
const KEY = 'lab-planner';

function toMin(s: string) { return parseClock(s) ?? 0; }

export function DailyPlanner() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState<Priority>('medium');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:00');
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState<'axis' | 'chart'>('axis');

  useEffect(() => { setTasks(loadLocal<Task[]>(KEY, [])); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) saveLocal(KEY, tasks); }, [tasks, hydrated]);

  const conflicts = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        const a = tasks[i], b = tasks[j];
        if (toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end)) { set.add(a.id); set.add(b.id); }
      }
    }
    return set;
  }, [tasks]);

  const add = () => {
    const s = toMin(start), en = toMin(end);
    if (!title.trim()) { setError('请填写任务名称。'); return; }
    if (s >= en) { setError('结束时间必须晚于开始时间。'); return; }
    setError('');
    setTasks((prev) => [...prev, { id: `t-${Date.now()}`, title: title.trim(), category, priority, start, end, done: false }]);
    setTitle('');
  };
  const remove = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const toggle = (id: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const chartOption = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => toMin(a.start) - toMin(b.start));
    return {
      tooltip: {
        trigger: 'axis' as const, axisPointer: { type: 'shadow' as const },
        formatter: (params: unknown) => {
          const arr = params as { dataIndex: number }[];
          if (!arr?.length) return '';
          const t = sorted[arr[0].dataIndex];
          return `${t.title}<br/>${t.start} – ${t.end}（${formatMinutes(toMin(t.end) - toMin(t.start))}）<br/>${t.category} · ${PRIORITY[t.priority].label}优先级`;
        },
      },
      grid: { left: 100, right: 24, top: 20, bottom: 34 },
      xAxis: {
        type: 'value' as const, min: 0, max: 1440, interval: 180,
        axisLabel: { color: '#7A736A', fontSize: 10, formatter: (v: number) => formatClock(v) },
        splitLine: { lineStyle: { color: '#F3EEE3' } },
      },
      yAxis: {
        type: 'category' as const, data: sorted.map((t) => t.title),
        axisLabel: { color: '#4A453F', fontSize: 11 }, axisTick: { show: false },
      },
      series: [
        { name: '占位', type: 'bar' as const, stack: 'time', silent: true, data: sorted.map((t) => toMin(t.start)), itemStyle: { color: 'transparent' }, barWidth: '55%' },
        {
          name: '时长', type: 'bar' as const, stack: 'time', barWidth: '55%',
          data: sorted.map((t) => ({ value: toMin(t.end) - toMin(t.start), itemStyle: { color: PRIORITY[t.priority].color, borderRadius: 4 } })),
        },
      ],
    };
  }, [tasks]);

  const sortedTasks = [...tasks].sort((a, b) => toMin(a.start) - toMin(b.start));

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="card-base p-6">
        <h2 className="mb-5 font-serif text-lg font-bold text-ink">添加任务</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-muted">任务名称</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：撰写项目方案" className="w-full rounded-lg border border-paper-300 bg-paper-50 px-3 py-2.5 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">分类</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-paper-300 bg-paper-50 px-3 py-2.5 text-sm">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">优先级</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full rounded-lg border border-paper-300 bg-paper-50 px-3 py-2.5 text-sm">
                <option value="high">高</option><option value="medium">中</option><option value="low">低</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">开始</label>
              <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="w-full rounded-lg border border-paper-300 bg-paper-50 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">结束</label>
              <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full rounded-lg border border-paper-300 bg-paper-50 px-3 py-2.5 text-sm" />
            </div>
          </div>
          {error && <p className="rounded-lg bg-caramel-50 px-3 py-2 text-xs text-caramel-600">{error}</p>}
          <button onClick={add} className="btn-primary w-full"><Plus className="h-4 w-4" /> 加入计划</button>
        </div>

        <div className="mt-7 border-t border-paper-200 pt-5">
          <h3 className="mb-3 font-serif text-base font-bold text-ink">任务列表（{tasks.length}）</h3>
          {tasks.length === 0 ? (
            <p className="py-6 text-center text-sm text-ink-faint">还没有任务。从上方添加第一个吧。</p>
          ) : (
            <ul className="max-h-96 space-y-2 overflow-y-auto pr-1">
              {sortedTasks.map((t) => (
                <li key={t.id} className={cn('flex items-start gap-3 rounded-lg border p-3', conflicts.has(t.id) ? 'border-caramel-300 bg-caramel-50/50' : 'border-paper-200 bg-paper-50')}>
                  <button onClick={() => toggle(t.id)} className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border', t.done ? 'border-forest bg-forest text-white' : 'border-paper-400')} aria-label="切换完成状态">
                    {t.done && <Check className="h-3 w-3" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={cn('truncate text-sm font-medium', t.done ? 'text-ink-faint line-through' : 'text-ink')}>{t.title}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{t.start}–{t.end} · {t.category}</p>
                    {conflicts.has(t.id) && <p className="mt-1 flex items-center gap-1 text-[11px] text-caramel-600"><AlertTriangle className="h-3 w-3" /> 时间与其他任务冲突</p>}
                  </div>
                  <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium', PRIORITY[t.priority].badge)}>{PRIORITY[t.priority].label}</span>
                  <button onClick={() => remove(t.id)} className="shrink-0 text-ink-faint hover:text-caramel-600" aria-label="删除任务"><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card-base p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg font-bold text-ink">今日时间轴</h2>
            {conflicts.size > 0 && <span className="inline-flex items-center gap-1 rounded-full bg-caramel-50 px-2.5 py-1 text-[11px] text-caramel-600"><AlertTriangle className="h-3 w-3" /> {conflicts.size} 处冲突</span>}
          </div>
          <div className="flex rounded-lg border border-paper-300 p-0.5">
            <button onClick={() => setView('axis')} className={cn('rounded-md px-3 py-1.5 text-xs font-medium', view === 'axis' ? 'bg-ink text-paper-50' : 'text-ink-muted')}><Clock3 className="mr-1 inline h-3.5 w-3.5" />时间轴</button>
            <button onClick={() => setView('chart')} className={cn('rounded-md px-3 py-1.5 text-xs font-medium', view === 'chart' ? 'bg-ink text-paper-50' : 'text-ink-muted')}><BarChart3 className="mr-1 inline h-3.5 w-3.5" />图表</button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-dashed border-paper-300 text-center">
            <Clock3 className="h-8 w-8 text-ink-faint" />
            <p className="mt-3 text-sm text-ink-muted">添加任务后，这里会显示你的 24 小时计划。</p>
          </div>
        ) : view === 'chart' ? (
          <EChart option={chartOption} height={Math.max(360, tasks.length * 48)} />
        ) : (
          <div className="relative max-h-[560px] overflow-y-auto rounded-xl border border-paper-200 bg-paper-50 p-4">
            <div className="relative" style={{ height: 24 * 52 }}>
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} className="absolute left-0 right-0 flex" style={{ top: h * 52, height: 52 }}>
                  <span className="w-12 shrink-0 pt-1 font-serif text-[11px] tabular-nums text-ink-faint">{String(h).padStart(2, '0')}:00</span>
                  <span className="mt-1 flex-1 border-t border-paper-200" />
                </div>
              ))}
              {sortedTasks.map((t) => {
                const top = (toMin(t.start) / 60) * 52;
                const height = Math.max(20, ((toMin(t.end) - toMin(t.start)) / 60) * 52 - 3);
                return (
                  <div
                    key={t.id}
                    className={cn('absolute left-12 right-2 overflow-hidden rounded-md border-l-4 px-2.5 py-1 text-left shadow-soft', t.done && 'opacity-55')}
                    style={{ top: top + 1, height, background: `${PRIORITY[t.priority].color}18`, borderColor: conflicts.has(t.id) ? '#B5651D' : PRIORITY[t.priority].color }}
                    title={`${t.title} ${t.start}–${t.end}`}
                  >
                    <p className="truncate text-xs font-semibold text-ink">{t.title}</p>
                    {height > 40 && <p className="truncate text-[10px] text-ink-muted">{t.start}–{t.end} · {t.category}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <p className="mt-4 flex items-start gap-2 rounded-lg bg-paper-100 p-3 text-[11px] leading-relaxed text-ink-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-caramel-500" />
          计划保存在本地浏览器。时间轴与图表会自动检测重叠的任务并提示冲突，但不会强制阻止——有时并行是合理的，判断权在你。
        </p>
      </div>
    </div>
  );
}
