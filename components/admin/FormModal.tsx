import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

interface FormModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent) => void;
    loading?: boolean;
    submitLabel?: string;
}

const FormModal: React.FC<FormModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    onSubmit,
    loading = false,
    submitLabel = 'Save',
}) => {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col animate-fade-in-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {children}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading && (
                                <svg
                                    className="animate-spin w-4 h-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                            )}
                            {submitLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormModal;

// Reusable form field components
export const FormField: React.FC<{
    label: string;
    required?: boolean;
    children: React.ReactNode;
    error?: string;
}> = ({ label, required, children, error }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {children}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);

export const Input: React.FC<
    React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }
> = ({ error, className = '', ...props }) => (
    <input
        {...props}
        className={`w-full px-4 py-2 rounded-lg border ${error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors ${className}`}
    />
);

export const Textarea: React.FC<
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }
> = ({ error, className = '', ...props }) => (
    <textarea
        {...props}
        className={`w-full px-4 py-2 rounded-lg border ${error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors resize-none ${className}`}
    />
);

export const Select: React.FC<
    React.SelectHTMLAttributes<HTMLSelectElement> & { error?: boolean }
> = ({ error, className = '', children, ...props }) => (
    <select
        {...props}
        className={`w-full px-4 py-2 rounded-lg border ${error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent transition-colors ${className}`}
    >
        {children}
    </select>
);
