import React from 'react';
import clsx from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({ label, error, className, options, ...props }) => {
    return (
        <div className="mb-4">
            {label && (
                <label className="block font-display font-bold text-xs uppercase mb-2">
                    {label}
                </label>
            )}
            <select
                className={clsx(
                    'w-full px-4 py-3 border-neo border-border bg-white font-sans focus:outline-none focus:border-accent transition-colors appearance-none',
                    error && 'border-error',
                    className
                )}
                {...props}
            >
                <option value="">Select an option...</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className="text-error text-xs font-bold mt-1">{error}</span>}
        </div>
    );
};

export default Select;
