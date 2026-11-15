import type { NavItem } from './types';

export const siteConfig = {
  name: '好好度过24小时',
  enName: '24 Hours, Well Lived.',
  slogan: 'Make Every Hour Count.',
  description:
    '研究时间、理解精力、管理注意力。一个关于时间管理、24小时生活方式、经典书籍与优质网站的知识型内容平台。',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://24hours-well.example.com',
  locale: 'zh_CN',
};

export const mainNav: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '时间管理', href: '/methods' },
  { label: '24小时生活', href: '/articles?category=24小时生活' },
  { label: '好书推荐', href: '/books' },
  { label: '网站收藏', href: '/websites' },
  { label: '时间实验室', href: '/lab' },
  { label: '关于', href: '/about' },
];

export const footerNav = [
  {
    title: '探索内容',
    items: [
      { label: '全部文章', href: '/articles' },
      { label: '时间管理方法', href: '/methods' },
      { label: '全球好书', href: '/books' },
      { label: '优质网站', href: '/websites' },
    ],
  },
  {
    title: '时间实验室',
    items: [
      { label: '24小时分配器', href: '/lab/24-hours' },
      { label: '时间审计', href: '/lab/time-audit' },
      { label: '每日计划', href: '/lab/planner' },
      { label: '每周复盘', href: '/lab/weekly-review' },
    ],
  },
  {
    title: '关于本站',
    items: [
      { label: '关于我们', href: '/about' },
      { label: '内容原则', href: '/about#principles' },
      { label: '资源声明', href: '/about#disclaimer' },
    ],
  },
];
