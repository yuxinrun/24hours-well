import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { WebsiteCard } from '@/components/content/Cards';
import { CategoryFilter } from '@/components/content/CategoryFilter';
import { websites, websiteCategories } from '@/data/websites';

export const metadata: Metadata = {
  title: '全球优质网站',
  description: '按时间管理、个人效率、习惯养成、科学研究、行为心理学、睡眠与精力、知识管理、个人成长分类的优质网站，链接真实有效。',
  openGraph: { title: '全球优质网站 | 好好度过24小时', description: '经过筛选的真实优质网站，附核心价值与适用人群。' },
};

export default function WebsitesPage() {
  const items = websites.map((site) => ({
    key: site.slug,
    category: site.category,
    content: <WebsiteCard site={site} />,
  }));

  return (
    <>
      <PageHero
        eyebrow="Curated Web"
        title="全球优质网站"
        description="从时间管理到睡眠科学，从习惯养成到知识管理。这里的每一个网站都真实存在、链接有效，并附上了推荐理由与适用人群。"
        breadcrumb={[{ label: '网站收藏' }]}
      />
      <div className="container-site py-12">
        <CategoryFilter
          basePath="/websites"
          categories={websiteCategories}
          items={items}
          unit="个网站"
        />
      </div>
    </>
  );
}
