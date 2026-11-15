import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';
import { getArticleSlugs } from '@/lib/articles';
import { methods } from '@/data/methods';
import { books } from '@/data/books';
import { websites } from '@/data/websites';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, '');
  const now = new Date();

  const staticRoutes = [
    '', '/articles', '/methods', '/books', '/websites', '/lab',
    '/lab/24-hours', '/lab/time-audit', '/lab/planner', '/lab/weekly-review', '/about',
  ].map((path) => ({ url: `${base}${path}`, lastModified: now, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.7 }));

  const articles = getArticleSlugs().map((slug) => ({ url: `${base}/articles/${slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 }));
  const methodRoutes = methods.map((m) => ({ url: `${base}/methods/${m.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 }));
  const bookRoutes = books.map((b) => ({ url: `${base}/books/${b.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 }));
  const websiteRoutes = websites.map((w) => ({ url: `${base}/websites/${w.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 }));

  return [...staticRoutes, ...articles, ...methodRoutes, ...bookRoutes, ...websiteRoutes];
}
