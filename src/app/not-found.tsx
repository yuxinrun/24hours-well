import Link from 'next/link';
import { Clock3, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-caramel-100 text-caramel-600">
        <Clock3 className="h-8 w-8" />
      </div>
      <p className="mt-6 font-serif text-6xl font-bold text-ink">404</p>
      <h1 className="mt-3 font-serif text-2xl font-bold text-ink">这一刻，似乎走错了地方</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
        你访问的页面不存在或已被移动。不如回到首页，重新规划这 24 小时。
      </p>
      <Link href="/" className="btn-primary mt-8"><ArrowLeft className="h-4 w-4" /> 返回首页</Link>
    </div>
  );
}
