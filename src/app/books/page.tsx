import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { BookCard } from '@/components/content/Cards';
import { CategoryFilter } from '@/components/content/CategoryFilter';
import { books, bookCategories } from '@/data/books';

export const metadata: Metadata = {
  title: '全球经典好书',
  description: '时间管理、习惯、注意力、效率与人生规划方面的中外经典书籍，含作者、出版信息、核心观点与实践方法。',
  openGraph: { title: '全球经典好书 | 好好度过24小时', description: '关于时间与生活的经典书单，信息以公开出版资料为准。' },
};

export default function BooksPage() {
  const items = books.map((book) => ({
    key: book.slug,
    category: book.category,
    content: <BookCard book={book} />,
  }));

  return (
    <>
      <PageHero
        eyebrow="The Reading Shelf"
        title="全球经典好书"
        description="关于时间、习惯、注意力与人生的必读书目。书名、作者与出版信息以公开资料为准，核心观点与实践方法为编辑整理，供参考与延伸阅读。"
        breadcrumb={[{ label: '全球好书' }]}
      />
      <div className="container-site py-12">
        <CategoryFilter
          basePath="/books"
          categories={bookCategories}
          items={items}
          unit="本书"
        />
      </div>
    </>
  );
}
