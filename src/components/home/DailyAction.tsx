'use client';

import { useEffect, useState } from 'react';
import { Check, RotateCcw, Sparkles } from 'lucide-react';
import { loadLocal, saveLocal } from '@/lib/storage';
import { cn } from '@/lib/utils';

const ACTIONS = [
  { id: 'focus', text: '关闭一个非必要通知，给注意力让出空间。' },
  { id: 'plan', text: '写下今天唯一最重要的一件事，并放进日程。' },
  { id: 'move', text: '起身走动 10 分钟，让身体与大脑恢复。' },
  { id: 'rest', text: '睡前 30 分钟放下屏幕，好好睡一觉。' },
];

export function DailyAction() {
  const [done, setDone] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const saved = loadLocal<{ date: string; ids: string[] } | null>('daily-action', null);
    if (saved && saved.date === today) setDone(saved.ids);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveLocal('daily-action', { date: new Date().toISOString().slice(0, 10), ids: done });
  }, [done, hydrated]);

  const toggle = (id: string) => setDone((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <section className="py-16 sm:py-20">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-[22px] border border-caramel-200 bg-gradient-to-br from-caramel-50 via-paper-50 to-paper-100 px-6 py-10 sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-caramel-100/60 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14">
            <div>
              <p className="eyebrow mb-3 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" /> Today&apos;s Micro Actions
              </p>
              <h2 className="font-serif text-2xl font-bold leading-tight text-ink sm:text-3xl">今天，就做这四件小事</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                改变不需要宏大的开始。点击勾选你完成的小行动，它们会保存在本地，明天重新开始。
              </p>
              <div className="mt-5 inline-flex items-center gap-3 rounded-full bg-paper-50 px-4 py-2 text-sm">
                <span className="font-serif text-lg font-bold text-caramel-600">{done.length}</span>
                <span className="text-ink-muted">/ {ACTIONS.length} 已完成</span>
                {done.length > 0 && (
                  <button onClick={() => setDone([])} className="ml-2 inline-flex items-center gap-1 text-xs text-ink-faint hover:text-caramel-600" aria-label="重置今日行动">
                    <RotateCcw className="h-3 w-3" /> 重置
                  </button>
                )}
              </div>
            </div>
            <ul className="space-y-2.5">
              {ACTIONS.map((a) => {
                const isDone = done.includes(a.id);
                return (
                  <li key={a.id}>
                    <button
                      onClick={() => toggle(a.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-all',
                        isDone
                          ? 'border-forest/30 bg-forest-soft/70 text-ink-muted line-through'
                          : 'border-paper-300 bg-paper-50 text-ink-soft hover:border-caramel-300 hover:shadow-soft'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                          isDone ? 'border-forest bg-forest text-white' : 'border-paper-400 bg-paper-50'
                        )}
                      >
                        {isDone && <Check className="h-3 w-3" />}
                      </span>
                      {a.text}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
