import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkText = '查看全部',
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="section-title">{title}</h2>
        {description && <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">{description}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-caramel-500 hover:text-caramel-600"
        >
          {linkText}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
