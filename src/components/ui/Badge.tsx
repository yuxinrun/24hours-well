import { cn } from '@/lib/utils';

export function Badge({
  className,
  tone = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: 'default' | 'caramel' | 'forest' | 'outline';
}) {
  const tones = {
    default: 'bg-paper-200 text-ink-soft',
    caramel: 'bg-caramel-100 text-caramel-600',
    forest: 'bg-forest-soft text-forest',
    outline: 'border border-paper-300 text-ink-muted',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium tracking-wide',
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
