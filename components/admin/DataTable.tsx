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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="animate-pulse">
                    <div className="h-12 bg-gray-100 dark:bg-gray-700" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-4 p-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                            {columns.map((column) => (
                                <th
                                    key={column.key as string}
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                                >
                                    {column.label}
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedData.map((item) => (
                            <tr
                                key={item[keyField] as string}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key as string}
                                        className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100"
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
                                                    className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
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
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, data.length)} of{' '}
                        {data.length} entries
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <FiChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
