import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid = false, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(
        'text-brand-950 flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm',
        'placeholder:text-brand-400',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid
          ? 'border-red-400 focus-visible:ring-red-400'
          : 'border-brand-200 focus-visible:ring-brand-500',
        className,
      )}
      {...props}
    />
  );
});
