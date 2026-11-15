import Link from 'next/link';
import { Clock3, ArrowUpRight } from 'lucide-react';
import { footerNav, siteConfig } from '@/lib/site';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-paper-300 bg-paper-100">
      <div className="container-site py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-paper-50">
                <Clock3 className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-[17px] font-bold text-ink">{siteConfig.name}</span>
                <span className="mt-1 text-[9px] uppercase tracking-[0.16em] text-ink-muted">24 Hours, Well Lived.</span>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-muted">
              每个人每天都拥有 24 小时。如何理解时间、安排时间、保护注意力、管理精力，并把时间投入真正重要的事情，是一门值得持续研究和实践的学问。
            </p>
            <p className="mt-4 font-serif text-sm italic text-caramel-600">{siteConfig.slogan}</p>
          </div>

          {footerNav.map((group) => (
            <div key={group.title} className="lg:col-span-2">
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink">{group.title}</h3>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-ink-muted transition-colors hover:text-caramel-600">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink">内容声明</h3>
            <p className="text-sm leading-relaxed text-ink-muted" id="disclaimer">
              本站文章参考公开的书籍与研究资料整理，力求标注出处；书籍与网站信息以官方资料为准，链接真实有效。本站不构成医疗或专业建议。
            </p>
            <Link href="/about" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-caramel-600 hover:text-caramel-700">
              了解更多 <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-paper-300 pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. 保留所有权利。</p>
          <p>Made with care for every hour that matters.</p>
        </div>
      </div>
    </footer>
  );
}
