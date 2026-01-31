import React from 'react';
import { FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    loading?: boolean;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    keyField?: keyof T;
    emptyMessage?: string;
}

function DataTable<T extends { id: string }>({
    columns,
    data,
    loading = false,
    onEdit,
    onDelete,
    keyField = 'id' as keyof T,
    emptyMessage = 'No data found',
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    const getValue = (item: T, key: keyof T | string): React.ReactNode => {
        const keys = (key as string).split('.');
        let value: unknown = item;
        for (const k of keys) {
            value = (value as Record<string, unknown>)?.[k];
        }
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        if (value instanceof Date) {
            return value.toLocaleDateString();
        }
        return value as React.ReactNode;
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-dark-background rounded-xl shadow-sm overflow-hidden">
                <div className="animate-pulse">
                    <div className="h-12 bg-green-50 dark:bg-green-900/30" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 border-t border-black/10 dark:border-white/10">
                            <div className="flex items-center gap-4 p-4">
                                <div className="h-4 bg-green-100 dark:bg-green-900/40 rounded w-1/4" />
                                <div className="h-4 bg-green-100 dark:bg-green-900/40 rounded w-1/3" />
                                <div className="h-4 bg-green-100 dark:bg-green-900/40 rounded w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-dark-background rounded-xl shadow-sm p-12 text-center">
                <p className="text-[#1c1a1c]/60 dark:text-white/60">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-dark-background rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-green-50/50 dark:bg-green-900/20">
                            {columns.map((column) => (
                                <th
                                    key={column.key as string}
                                    className="px-6 py-3 text-left text-xs font-semibold text-[#1c1a1c]/70 dark:text-white/70 uppercase tracking-wider"
                                >
                                    {column.label}
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="px-6 py-3 text-right text-xs font-semibold text-[#1c1a1c]/70 dark:text-white/70 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedData.map((item) => (
                            <tr
                                key={item[keyField] as string}
                                className="hover:bg-green-50/30 dark:hover:bg-green-900/20 transition-colors"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key as string}
                                        className="px-6 py-4 text-sm text-[#1c1a1c] dark:text-white"
                                    >
                                        {column.render
                                            ? column.render(item)
                                            : getValue(item, column.key)}
                                    </td>
                                ))}
                                {(onEdit || onDelete) && (
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {onEdit && (
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 className="w-4 h-4" />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-black/10 dark:border-white/10">
                    <p className="text-sm text-[#1c1a1c]/60 dark:text-white/60">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.length)} of{' '}
                        {data.length} entries
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-black/15 dark:border-white/15 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                        >
                            <FiChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-[#1c1a1c]/70 dark:text-white/70">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-black/15 dark:border-white/15 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                        >
                            <FiChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataTable;


