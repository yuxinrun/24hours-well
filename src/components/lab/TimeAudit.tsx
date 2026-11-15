'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Info, Sparkles, Clock3 } from 'lucide-react';
import { EChart, CHART_PALETTE } from '@/components/charts/EChart';
import { loadLocal, saveLocal } from '@/lib/storage';
import { cn, formatMinutes, formatClock, parseClock } from '@/lib/utils';

type Category = '睡眠' | '工作' | '学习' | '运动' | '通勤' | '饮食' | '休闲' | '社交' | '分心/无意识消耗' | '其他';
interface Entry { id: string; category: Category; start: string; end: string; note?: string }

const CATEGORIES: Category[] = ['睡眠', '工作', '学习', '运动', '通勤', '饮食', '休闲', '社交', '分心/无意识消耗', '其他'];
const COLORS: Record<Category, string> = {
  睡眠: CHART_PALETTE[1], 工作: CHART_PALETTE[0], 学习: CHART_PALETTE[2], 运动: CHART_PALETTE[4],
  通勤: CHART_PALETTE[5], 饮食: CHART_PALETTE[3], 休闲: CHART_PALETTE[6], 社交: '#B08D57',
  '分心/无意识消耗': '#B5651D', 其他: '#A9A297',
};
const INVEST: Category[] = ['工作', '学习', '运动'];
const DRAIN: Category[] = ['分心/无意识消耗'];
const DEMO: Entry[] = [
  { id: 'd1', category: '睡眠', start: '23:30', end: '07:00', note: '演示' },
  { id: 'd2', category: '工作', start: '09:00', end: '12:00', note: '演示' },
  { id: 'd3', category: '分心/无意识消耗', start: '12:00', end: '13:00', note: '演示' },
  { id: 'd4', category: '学习', start: '20:00', end: '21:30', note: '演示' },
];
const KEY = 'lab-time-audit';

function durationOf(e: Entry): number {
  const s = parseClock(e.start);
  const en = parseClock(e.end);
  if (s === null || en === null) return 0;
  return en >= s ? en - s : en + 1440 - s;
}

export function TimeAudit() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [category, setCategory] = useState<Category>('工作');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:00');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    setEntries(loadLocal<Entry[]>(KEY, []));
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) saveLocal(KEY, entries); }, [entries, hydrated]);

  const add = () => {
    const s = parseClock(start), en = parseClock(end);
    if (s === null || en === null) { setError('请输入有效的开始与结束时间。'); return; }
    if (s === en) { setError('开始与结束时间不能相同。'); return; }
    setError('');
    setEntries((prev) => [...prev, { id: `e-${Date.now()}`, category, start, end, note: note.trim() }]);
    setNote('');
  };
  const remove = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));

  const display = showDemo && entries.length === 0 ? DEMO : entries;
  const total = display.reduce((s, e) => s + durationOf(e), 0);

  const byCategory = useMemo(() => {
    const map = new Map<Category, number>();
    display.forEach((e) => map.set(e.category, (map.get(e.category) ?? 0) + durationOf(e)));
    return Array.from(map, ([name, minutes]) => ({ name, minutes })).sort((a, b) => b.minutes - a.minutes);
  }, [display]);

  const investMin = display.filter((e) => INVEST.includes(e.category)).reduce((s, e) => s + durationOf(e), 0);
  const drainMin = display.filter((e) => DRAIN.includes(e.category)).reduce((s, e) => s + durationOf(e), 0);

  const pieOption = useMemo(() => ({
    tooltip: { trigger: 'item' as const, formatter: (p: { name: string; value: number; percent: number }) => `${p.name}：${formatMinutes(p.value)}（${p.percent}%）` },
    legend: { type: 'scroll' as const, bottom: 0, textStyle: { color: '#7A736A', fontSize: 11 } },
    series: [{
      type: 'pie' as const, radius: ['48%', '72%'], center: ['50%', '44%'],
      itemStyle: { borderRadius: 5, borderColor: '#FDFBF7', borderWidth: 2 },
      label: { show: false },
      data: byCategory.map((c) => ({ value: c.minutes, name: c.name, itemStyle: { color: COLORS[c.name] } })),
    }],
  }), [byCategory]);

  const barOption = useMemo(() => ({
    tooltip: { trigger: 'axis' as const, valueFormatter: (v: number) => formatMinutes(v) },
    grid: { left: 90, right: 20, top: 16, bottom: 24 },
    xAxis: { type: 'value' as const, axisLabel: { color: '#7A736A', fontSize: 10 }, splitLine: { lineStyle: { color: '#F3EEE3' } } },
    yAxis: { type: 'category' as const, data: [...byCategory].reverse().map((c) => c.name), axisLabel: { color: '#4A453F', fontSize: 11 }, axisLine: { show: false }, axisTick: { show: false } },
    series: [{
      type: 'bar' as const,
      data: [...byCategory].reverse().map((c) => ({ value: c.minutes, itemStyle: { color: COLORS[c.name], borderRadius: [0, 5, 5, 0] } })),
      barWidth: '55%',
    }],
  }), [byCategory]);

  const suggestions = useMemo(() => {
    const s: string[] = [];
    const get = (c: Category) => byCategory.find((x) => x.name === c)?.minutes ?? 0;
    if (get('分心/无意识消耗') >= 60) s.push(`「分心/无意识消耗」达到 ${formatMinutes(get('分心/无意识消耗'))}。尝试把其中一段替换为低刺激活动，或将相关应用移出首屏。`);
    if (get('睡眠') > 0 && get('睡眠') < 420) s.push(`睡眠记录为 ${formatMinutes(get('睡眠'))}，低于常见的 7 小时建议。可考虑提前 30 分钟放下屏幕。`);
    if (get('学习') === 0 && get('工作') > 0) s.push('这一天没有记录学习时间。若想持续成长，可尝试每天 25 分钟的微学习。');
    if (get('运动') === 0) s.push('没有记录运动。哪怕 10 分钟的散步，也有助于恢复精力。');
    if (investMin > 0 && investMin < total * 0.3 && total > 0) s.push('投入型活动（工作/学习/运动）占比相对不高，可审视是否被低价值事务挤占。');
    const gaps: string[] = [];
    const sorted = [...display].sort((a, b) => (parseClock(a.start) ?? 0) - (parseClock(b.start) ?? 0));
    for (let i = 1; i < sorted.length; i++) {
      const prevEnd = parseClock(sorted[i - 1].end) ?? 0;
      const curStart = parseClock(sorted[i].start) ?? 0;
      if (curStart - prevEnd >= 60) gaps.push(`${formatClock(prevEnd)}–${formatClock(curStart)}`);
    }
    if (gaps.length) s.push(`以下区间未被记录（可能也是时间黑洞）：${gaps.slice(0, 3).join('、')}。`);
    if (!s.length) s.push('记录结构较均衡。可以进一步记录"分心"发生的具体时刻，找出触发因素。');
    return s;
  }, [byCategory, investMin, total, display]);

  return (
    <div className="space-y-6">
      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="card-base p-6">
          <h2 className="mb-5 font-serif text-lg font-bold text-ink">记录一段活动</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">活动类别</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="w-full rounded-lg border border-paper-300 bg-paper-50 px-3 py-2.5 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-muted">开始时间</label>
                <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="w-full rounded-lg border border-paper-300 bg-paper-50 px-3 py-2.5 text-sm" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-muted">结束时间</label>
                <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full rounded-lg border border-paper-300 bg-paper-50 px-3 py-2.5 text-sm" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">备注（可选）</label>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="例如：上午专注写方案" className="w-full rounded-lg border border-paper-300 bg-paper-50 px-3 py-2.5 text-sm" />
            </div>
            {error && <p className="rounded-lg bg-caramel-50 px-3 py-2 text-xs text-caramel-600">{error}</p>}
            <button onClick={add} className="btn-primary w-full"><Plus className="h-4 w-4" /> 添加记录</button>
            <p className="text-[11px] leading-relaxed text-ink-faint">跨午夜的时间（如 23:30–07:00）会自动按次日计算。数据只保存在本地浏览器。</p>
          </div>
        </div>

        <div className="card-base p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-ink">今日记录</h2>
            <label className="flex items-center gap-2 text-xs text-ink-muted">
              <input type="checkbox" checked={showDemo} onChange={(e) => setShowDemo(e.target.checked)} className="accent-caramel-500" />
              演示数据
            </label>
          </div>
          {display.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-paper-300 text-center">
              <Clock3 className="h-8 w-8 text-ink-faint" />
              <p className="mt-3 text-sm text-ink-muted">还没有记录。从左侧添加一段活动，或勾选「演示数据」预览效果。</p>
            </div>
          ) : (
            <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {display.map((e) => (
                <li key={e.id} className="flex items-center gap-3 rounded-lg border border-paper-200 bg-paper-50 p-3">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: COLORS[e.category] }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{e.category} <span className="font-normal text-ink-faint">{e.start}–{e.end}</span></p>
                    {e.note && <p className="truncate text-xs text-ink-muted">{e.note}</p>}
                  </div>
                  <span className="shrink-0 font-serif text-sm font-semibold text-ink">{formatMinutes(durationOf(e))}</span>
                  {!showDemo && <button onClick={() => remove(e.id)} className="shrink-0 text-ink-faint hover:text-caramel-600" aria-label="删除记录"><Trash2 className="h-4 w-4" /></button>}
                </li>
              ))}
            </ul>
          )}
          {display.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4 border-t border-paper-200 pt-4 text-xs">
              <span className="text-ink-muted">记录总计 <strong className="font-serif text-base text-ink">{formatMinutes(total)}</strong></span>
              <span className="text-forest">投入型 <strong className="font-serif text-base">{formatMinutes(investMin)}</strong></span>
              <span className="text-caramel-600">分心消耗 <strong className="font-serif text-base">{formatMinutes(drainMin)}</strong></span>
            </div>
          )}
        </div>
      </div>

      {display.length > 0 && (
        <>
          <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="card-base p-5 sm:p-6">
              <h3 className="mb-2 font-serif text-lg font-bold text-ink">时间使用类别占比</h3>
              <EChart option={pieOption} height={300} />
            </div>
            <div className="card-base p-5 sm:p-6">
              <h3 className="mb-2 font-serif text-lg font-bold text-ink">每日时间使用分布</h3>
              <EChart option={barOption} height={300} />
            </div>
          </div>

          <div className="card-base border-forest/20 bg-forest-soft/30 p-6 sm:p-8">
            <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-ink"><Sparkles className="h-5 w-5 text-forest" /> 优化建议</h3>
            <ul className="space-y-3">
              {suggestions.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest font-serif text-xs font-bold text-white">{i + 1}</span>{s}
                </li>
              ))}
            </ul>
            <p className="mt-5 flex items-start gap-2 border-t border-forest/15 pt-4 text-xs text-ink-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              以上建议由规则自动生成，仅供参考，不构成科学定论或专业建议。
            </p>
          </div>
        </>
      )}
    </div>
  );
}
