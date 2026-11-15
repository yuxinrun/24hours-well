'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Settings2, Timer as TimerIcon, Info } from 'lucide-react';
import { EChart } from '@/components/charts/EChart';
import { loadLocal, saveLocal } from '@/lib/storage';
import { cn } from '@/lib/utils';

type Mode = 'focus' | 'break';
interface FocusRecord { date: string; minutes: number; completedAt: string }

const KEY = 'focus-records';

function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function FocusTimer() {
  const [focusMin, setFocusMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [mode, setMode] = useState<Mode>('focus');
  const [secondsLeft, setSecondsLeft] = useState(focusMin * 60);
  const [running, setRunning] = useState(false);
  const [records, setRecords] = useState<FocusRecord[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const totalSeconds = (mode === 'focus' ? focusMin : breakMin) * 60;

  useEffect(() => {
    setRecords(loadLocal<FocusRecord[]>(KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveLocal(KEY, records);
  }, [records, hydrated]);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
  }, [focusMin, breakMin, mode, totalSeconds]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(timer);
          if (mode === 'focus') {
            setRecords((prev) => [...prev, { date: todayKey(), minutes: focusMin, completedAt: new Date().toISOString() }]);
          }
          setMode((m) => (m === 'focus' ? 'break' : 'focus'));
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, mode, focusMin]);

  useEffect(() => {
    document.title = running
      ? `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')} · ${mode === 'focus' ? '专注中' : '休息中'}`
      : '好好度过24小时 — 时间实验室';
    return () => { document.title = '好好度过24小时 — 时间实验室'; };
  }, [secondsLeft, running, mode]);

  const progress = totalSeconds > 0 ? (totalSeconds - secondsLeft) / totalSeconds : 0;
  const radius = 92;
  const circumference = 2 * Math.PI * radius;

  const last7 = useMemo(() => {
    const days: { key: string; label: string; minutes: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = todayKey(d);
      const minutes = records.filter((r) => r.date === key).reduce((s, r) => s + r.minutes, 0);
      days.push({ key, label: `${d.getMonth() + 1}/${d.getDate()}`, minutes });
    }
    return days;
  }, [records]);

  const demo = [
    { label: '示例 1', minutes: 75 }, { label: '示例 2', minutes: 100 },
    { label: '示例 3', minutes: 50 }, { label: '示例 4', minutes: 125 },
    { label: '示例 5', minutes: 75 }, { label: '示例 6', minutes: 150 }, { label: '示例 7', minutes: 100 },
  ];
  const chartData = showDemo ? demo : last7;
  const hasRealData = last7.some((d) => d.minutes > 0);

  const option = useMemo(() => ({
    tooltip: { trigger: 'axis' as const, valueFormatter: (v: number) => `${v} 分钟` },
    grid: { left: 40, right: 16, top: 20, bottom: 30 },
    xAxis: { type: 'category' as const, data: chartData.map((d) => d.label), axisLabel: { color: '#7A736A', fontSize: 11 }, axisLine: { lineStyle: { color: '#DED2BE' } } },
    yAxis: { type: 'value' as const, name: '分钟', nameTextStyle: { color: '#A9A297', fontSize: 10 }, axisLabel: { color: '#7A736A', fontSize: 11 }, splitLine: { lineStyle: { color: '#F3EEE3' } } },
    series: [{
      type: 'bar' as const,
      data: chartData.map((d) => d.minutes),
      barWidth: '46%',
      itemStyle: { color: '#C67C4B', borderRadius: [6, 6, 0, 0] },
    }],
  }), [chartData]);

  const todayMinutes = records.filter((r) => r.date === todayKey()).reduce((s, r) => s + r.minutes, 0);

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="card-base flex flex-col items-center p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2 self-start text-xs font-medium text-ink-muted">
          <TimerIcon className="h-4 w-4 text-caramel-500" /> 番茄式专注计时器
        </div>
        <div className="relative my-2 h-56 w-56 sm:h-64 sm:w-64">
          <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
            <circle cx="110" cy="110" r={radius} fill="none" stroke="#F3EEE3" strokeWidth="12" />
            <circle
              cx="110" cy="110" r={radius} fill="none"
              stroke={mode === 'focus' ? '#C67C4B' : '#4F6E58'} strokeWidth="12" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 0.5s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-5xl font-bold tabular-nums text-ink sm:text-6xl">
              {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}
            </span>
            <span className={cn('mt-2 rounded-full px-3 py-1 text-xs font-medium', mode === 'focus' ? 'bg-caramel-100 text-caramel-600' : 'bg-forest-soft text-forest')}>
              {mode === 'focus' ? '专注中' : '休息中'}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => setRunning((r) => !r)} className="btn-primary min-w-[120px]">
            {running ? <><Pause className="h-4 w-4" /> 暂停</> : <><Play className="h-4 w-4" /> 开始</>}
          </button>
          <button onClick={() => { setRunning(false); setSecondsLeft(totalSeconds); }} className="btn-outline" aria-label="重置计时器">
            <RotateCcw className="h-4 w-4" /> 重置
          </button>
          <button onClick={() => { setRunning(false); setMode((m) => (m === 'focus' ? 'break' : 'focus')); }} className="btn-outline" aria-label="跳到下一阶段">
            <SkipForward className="h-4 w-4" /> 跳过
          </button>
        </div>

        <div className="mt-7 w-full border-t border-paper-200 pt-5">
          <p className="mb-3 flex items-center gap-2 text-xs font-medium text-ink-muted"><Settings2 className="h-3.5 w-3.5" /> 自定义时长（分钟）</p>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              专注
              <input type="number" min={1} max={180} value={focusMin} onChange={(e) => setFocusMin(Math.max(1, Math.min(180, Number(e.target.value) || 1)))} className="w-16 rounded-lg border border-paper-300 bg-paper-50 px-2 py-1.5 text-center text-sm" />
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              休息
              <input type="number" min={1} max={60} value={breakMin} onChange={(e) => setBreakMin(Math.max(1, Math.min(60, Number(e.target.value) || 1)))} className="w-16 rounded-lg border border-paper-300 bg-paper-50 px-2 py-1.5 text-center text-sm" />
            </label>
          </div>
          <p className="mt-4 text-xs text-ink-faint">今日已完成 <strong className="font-serif text-base text-caramel-600">{todayMinutes}</strong> 分钟专注 · 共 {records.filter((r) => r.date === todayKey()).length} 次</p>
        </div>
      </div>

      <div className="card-base p-6 sm:p-8">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-ink">专注时长趋势</h3>
            <p className="mt-1 text-xs text-ink-muted">最近 7 天 · 数据来自本浏览器的真实记录</p>
          </div>
          <label className="flex items-center gap-2 text-xs text-ink-muted">
            <input type="checkbox" checked={showDemo} onChange={(e) => setShowDemo(e.target.checked)} className="accent-caramel-500" />
            查看演示数据
          </label>
        </div>
        <EChart option={option} height={280} />
        {!hasRealData && !showDemo && (
          <p className="mt-2 flex items-start gap-2 rounded-lg bg-paper-100 p-3 text-xs leading-relaxed text-ink-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-caramel-500" />
            还没有真实专注记录。完成一个专注时段后，图表会自动显示你的趋势；也可以勾选「查看演示数据」预览效果（演示数据非真实记录）。
          </p>
        )}
        {records.length > 0 && (
          <div className="mt-4 border-t border-paper-200 pt-4">
            <p className="mb-2 text-xs font-medium text-ink-muted">最近记录</p>
            <ul className="max-h-32 space-y-1.5 overflow-y-auto text-xs text-ink-muted">
              {records.slice(-5).reverse().map((r, i) => (
                <li key={i} className="flex justify-between border-b border-paper-100 py-1 last:border-0">
                  <span>{r.date}</span><span className="text-caramel-600">+{r.minutes} 分钟</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
