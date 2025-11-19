import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block font-display font-bold text-xs uppercase mb-2">
                    {label}
                </label>
            )}
            <input
                className={clsx(
                    'w-full px-4 py-3 border-neo border-border bg-white font-sans focus:outline-none focus:border-accent transition-colors',
                    error && 'border-error',
                    className
                )}
                {...props}
            />
            {error && <span className="text-error text-xs font-bold mt-1">{error}</span>}
        </div>
    );
};

export default Input;
