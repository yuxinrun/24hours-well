import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Article } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'articles');

/** 将 frontmatter 中的日期统一格式化为 YYYY-MM-DD 字符串（gray-matter 会把无引号日期解析为 Date） */
function normalizeDate(value: unknown): string {
  if (value instanceof Date) {
    const y = value.getUTCFullYear();
    const m = String(value.getUTCMonth() + 1).padStart(2, '0');
    const d = String(value.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return String(value ?? '');
}

/** 展示用中文日期：2026 年 1 月 18 日 */
export { formatDateCN } from './utils';

function readAllFiles(): { slug: string; raw: string }[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => ({
      slug: file.replace(/\.mdx$/, ''),
      raw: fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8'),
    }));
}

export function getAllArticles(): Article[] {
  return readAllFiles()
    .map(({ slug, raw }) => {
      const { data } = matter(raw);
      return {
        slug,
        title: String(data.title ?? ''),
        subtitle: data.subtitle ? String(data.subtitle) : undefined,
        excerpt: String(data.excerpt ?? ''),
        category: String(data.category ?? '时间思考'),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        date: normalizeDate(data.date),
        readMinutes: Number(data.readMinutes ?? 8),
        cover: String(data.cover ?? ''),
        coverAlt: String(data.coverAlt ?? ''),
        featured: Boolean(data.featured),
        author: data.author ? String(data.author) : '编辑部',
      } as Article;
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticleBySlug(slug: string): { meta: Article; content: string } | null {
  const file = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, 'utf-8');
  const { data, content } = matter(raw);
  const meta: Article = {
    slug,
    title: String(data.title ?? ''),
    subtitle: data.subtitle ? String(data.subtitle) : undefined,
    excerpt: String(data.excerpt ?? ''),
    category: String(data.category ?? '时间思考'),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    date: normalizeDate(data.date),
    readMinutes: Number(data.readMinutes ?? 8),
    cover: String(data.cover ?? ''),
    coverAlt: String(data.coverAlt ?? ''),
    featured: Boolean(data.featured),
    author: data.author ? String(data.author) : '编辑部',
  };
  return { meta, content };
}

export function getArticleSlugs(): string[] {
  return readAllFiles().map(({ slug }) => slug);
}

export function getFeaturedArticle(): Article | undefined {
  return getAllArticles().find((a) => a.featured);
}

export function getRelatedArticles(currentSlug: string, limit = 3): Article[] {
  const all = getAllArticles();
  const current = all.find((a) => a.slug === currentSlug);
  if (!current) return all.slice(0, limit);
  const scored = all
    .filter((a) => a.slug !== currentSlug)
    .map((a) => ({
      article: a,
      score:
        (a.category === current.category ? 2 : 0) +
        a.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .sort((x, y) => y.score - x.score);
  return scored.slice(0, limit).map((s) => s.article);
}

export const articleCategories = [
  '24小时生活',
  '时间管理方法',
  '人生与时间思考',
  '精力与注意力',
];
