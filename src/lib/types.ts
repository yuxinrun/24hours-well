export type Locale = 'zh' | 'en';

export interface Article {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readMinutes: number;
  cover: string;
  coverAlt: string;
  featured?: boolean;
  author?: string;
  /** MDX 正文（由 content 目录读取时注入） */
  content?: string;
}

export interface MethodStep {
  title: string;
  detail: string;
}

export interface Method {
  slug: string;
  name: string;
  enName: string;
  icon: string;
  oneLiner: string;
  summary: string;
  suitableFor: string[];
  steps: MethodStep[];
  example: string;
  commonMistakes: { mistake: string; fix: string }[];
  relatedBooks: string[];
  color: string;
}

export interface Book {
  slug: string;
  title: string;
  originalTitle: string;
  author: string;
  authorEn: string;
  country: string;
  year: string;
  publisher: string;
  category: string;
  coverColor: string;
  coverAccent: string;
  coreIdeas: string[];
  whyRead: string;
  suitableFor: string[];
  practice: string[];
  relatedSlugs: string[];
  link?: { label: string; url: string };
  verified: boolean;
}

export interface Website {
  slug: string;
  name: string;
  url: string;
  region?: string;
  category: string;
  positioning: string;
  mainContent: string;
  value: string;
  reason: string;
  suitableFor: string[];
  verified: boolean;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface TimeCategory {
  id: string;
  label: string;
  minutes: number;
  color: string;
}
