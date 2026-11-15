import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caramel-500 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-ink text-paper-50 hover:bg-caramel-500 hover:shadow-soft',
        outline: 'border border-ink/20 text-ink hover:border-ink/50 hover:bg-paper-100',
        caramel: 'bg-caramel-500 text-white hover:bg-caramel-600 hover:shadow-soft',
        ghost: 'text-ink hover:bg-paper-100',
        forest: 'bg-forest text-white hover:bg-forest-light hover:shadow-soft',
      },
      size: {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3',
        lg: 'px-7 py-3.5 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

interface ButtonLinkProps extends VariantProps<typeof buttonVariants> {
  href: string;
  className?: string;
  children: React.ReactNode;
  'aria-label'?: string;
}

export function ButtonLink({ href, className, variant, size, children, ...rest }: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...rest}>
      {children}
    </Link>
  );
}
