import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variants = {
  primary:   'bg-brand-600 text-white hover:bg-brand-700 border-transparent shadow-sm',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-transparent',
  danger:    'bg-red-600 text-white hover:bg-red-700 border-transparent shadow-sm',
  ghost:     'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent',
  outline:   'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center gap-2 justify-center font-medium rounded-lg border',
        'transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
export default Button;
