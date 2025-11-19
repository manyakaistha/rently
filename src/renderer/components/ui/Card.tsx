import React from 'react';
import clsx from 'clsx';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

const Card: React.FC<CardProps> = ({ children, className, title }) => {
    return (
        <div className={clsx('bg-white border-neo border-border shadow-neo p-6 mb-6', className)}>
            {title && (
                <h3 className="font-display font-bold text-2xl uppercase mb-5 pb-4 border-b-2 border-border">
                    {title}
                </h3>
            )}
            {children}
        </div>
    );
};

export default Card;
