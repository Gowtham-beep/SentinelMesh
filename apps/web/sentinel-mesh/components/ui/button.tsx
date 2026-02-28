import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = {
    default: 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-semibold',
    destructive: 'bg-red-500/20 text-red-400 ring-1 ring-red-500/30 hover:bg-red-500/30',
    outline: 'border border-slate-700 bg-transparent text-slate-300 hover:border-slate-600 hover:bg-slate-800/60 hover:text-slate-100',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700',
    ghost: 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200',
    link: 'text-cyan-400 underline-offset-4 hover:underline',
};

const buttonSizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-9 w-9',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof buttonVariants;
    size?: keyof typeof buttonSizes;
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
        const commonClasses = cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
            buttonVariants[variant],
            buttonSizes[size],
            className
        );

        if (asChild) {
            return <Slot className={commonClasses} ref={ref} {...props}>{children}</Slot>;
        }

        return (
            <button className={commonClasses} ref={ref} disabled={disabled || isLoading} {...props}>
                {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
