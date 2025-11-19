import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    ...props
}) => {
    const variants = {
        primary: 'bg-accent text-white hover:bg-blue-600',
        secondary: 'bg-white text-fg hover:bg-gray-100',
        danger: 'bg-error text-white hover:bg-red-600',
        success: 'bg-success text-border hover:bg-green-400',
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs shadow-neo-sm hover:shadow-neo-hover hover:translate-x-[2px] hover:translate-y-[2px]',
        md: 'px-6 py-3 text-sm shadow-neo hover:shadow-neo-hover hover:translate-x-[4px] hover:translate-y-[4px]',
        lg: 'px-8 py-4 text-base shadow-neo hover:shadow-neo-hover hover:translate-x-[4px] hover:translate-y-[4px]',
    };

    return (
        <button
            className={clsx(
                'font-display font-bold uppercase border-neo border-border transition-all',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
