import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { ArticleCard } from '@/components/content/Cards';
import { CategoryFilter } from '@/components/content/CategoryFilter';
import { getAllArticles, articleCategories } from '@/lib/articles';

export const metadata: Metadata = {
  title: '文章中心',
  description: '关于时间管理、24小时生活、精力与注意力的深度文章。有结构、有依据、能落地。',
  openGraph: { title: '文章中心 | 好好度过24小时', description: '关于时间管理、24小时生活、精力与注意力的深度文章。' },
};

export default function ArticlesPage() {
  const all = getAllArticles();
  const items = all.map((article) => ({
    key: article.slug,
    category: article.category,
    content: <ArticleCard article={article} />,
  }));

  return (
    <>
      <PageHero
        eyebrow="The Journal"
        title="文章中心"
        description="不是碎片化的技巧，而是有结构、有依据、能落地的深度思考。读完，你会知道今天可以做什么、明天如何改进。"
        breadcrumb={[{ label: '文章中心' }]}
      />
      <div className="container-site py-12">
        <CategoryFilter
          basePath="/articles"
          categories={articleCategories}
          items={items}
          allLabel="全部文章"
          unit="篇文章"
          gridClass="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        />
      </div>
    </>
  );
}
