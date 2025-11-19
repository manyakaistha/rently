import React from 'react';


interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white border-neo border-border shadow-[16px_16px_0px_#000000] w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="p-6 border-b-neo border-border flex justify-between items-center">
                    <h3 className="font-display font-bold text-2xl uppercase">{title}</h3>
                    <button onClick={onClose} className="text-2xl font-bold hover:text-accent">&times;</button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                    {children}
                </div>

                {footer && (
                    <div className="p-6 border-t-neo border-border bg-gray-50 flex justify-end gap-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
