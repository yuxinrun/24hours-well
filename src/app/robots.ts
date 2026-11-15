import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/$/, '');
  const pathname = new URL(siteConfig.url).pathname.replace(/\/$/, '');
  return {
    rules: { userAgent: '*', allow: '/', disallow: [`${pathname}/_next/`] },
    sitemap: `${base}/sitemap.xml`,
  };
}
