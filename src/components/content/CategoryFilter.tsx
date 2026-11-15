'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type FilterItem = {
  key: string;
  category: string;
  content: ReactNode;
};

type Props = {
  basePath: string;
  categories: string[];
  items: FilterItem[];
  allLabel?: string;
  unit?: string;
  gridClass?: string;
};

/**
 * 客户端分类筛选：全部条目由服务端预渲染并输出 HTML（SEO 友好），
 * 这里只负责根据 URL 参数显示/隐藏，并用 History API 同步地址栏。
 * 因此列表页可以静态导出到 GitHub Pages。
 */
export function CategoryFilter({
  basePath,
  categories,
  items,
  allLabel = '全部',
  unit = '条',
  gridClass = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
}: Props) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const syncFromUrl = () => {
      const value = new URLSearchParams(window.location.search).get('category');
      setActive(value && categories.includes(value) ? value : null);
    };
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, [categories]);

  const select = (category: string | null) => {
    setActive(category);
    const url = category
      ? `${basePath}?category=${encodeURIComponent(category)}`
      : basePath;
    window.history.pushState(null, '', url);
  };

  const visible = active ? items.filter((item) => item.category === active) : items;
  const countFor = (category: string) => items.filter((item) => item.category === category).length;

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2 border-b border-paper-200 pb-6">
        <button
          type="button"
          onClick={() => select(null)}
          aria-pressed={!active}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            !active ? 'bg-ink text-paper-50' : 'bg-paper-100 text-ink-soft hover:bg-paper-200'
          )}
        >
          {allLabel} <span className="ml-1 opacity-60">{items.length}</span>
        </button>
        {categories.map((category) => {
          const count = countFor(category);
          if (!count) return null;
          return (
            <button
              key={category}
              type="button"
              onClick={() => select(category)}
              aria-pressed={active === category}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                active === category ? 'bg-ink text-paper-50' : 'bg-paper-100 text-ink-soft hover:bg-paper-200'
              )}
            >
              {category} <span className="ml-1 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <p className="mb-6 text-sm text-ink-faint">共 {visible.length} {unit}</p>
      <div className={gridClass}>
        {visible.map((item) => <div key={item.key} className="min-w-0">{item.content}</div>)}
      </div>
      {visible.length === 0 && (
        <div className="rounded-card border border-dashed border-paper-300 py-20 text-center text-ink-muted">
          该分类暂无内容，<button type="button" onClick={() => select(null)} className="text-caramel-600 hover:underline">查看全部</button>。
        </div>
      )}
    </>
  );
}
