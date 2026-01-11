import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Simplified version of button
const buttonVariants = {
    default: "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90",
    destructive: "bg-red-500 text-zinc-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/90",
    outline: "border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80",
    ghost: "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
    link: "text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50",
}

const buttonSizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof buttonVariants;
    size?: keyof typeof buttonSizes;
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
        const commonClasses = cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300",
            buttonVariants[variant],
            buttonSizes[size],
            className
        );

        if (asChild) {
            return (
                <Slot
                    className={commonClasses}
                    ref={ref}
                    {...props}
                >
                    {children}
                </Slot>
            );
        }

        return (
            <button
                className={commonClasses}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
