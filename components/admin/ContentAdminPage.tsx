import React, { useEffect, useMemo, useState } from 'react';
import { FiEdit2, FiPlus, FiRefreshCw, FiSave, FiTrash2, FiX } from 'react-icons/fi';
import type { IconType } from 'react-icons';

export type ContentField<TForm> = {
    name: keyof TForm;
    label: string;
    type?: 'text' | 'textarea' | 'date' | 'number' | 'url' | 'select';
    required?: boolean;
    placeholder?: string;
    helper?: string;
    colSpan?: 1 | 2;
    options?: { label: string; value: string }[];
};

type ContentService<TItem> = {
    getAll: () => Promise<TItem[]>;
    create: (payload: any) => Promise<TItem>;
    update: (id: string, payload: any) => Promise<TItem>;
    delete: (id: string) => Promise<void>;
};

type ContentAdminPageProps<TItem extends { id: string }, TForm extends Record<string, string>> = {
    title: string;
    singularLabel: string;
    badgeLabel: string;
    description: string;
    icon: IconType;
    service: ContentService<TItem>;
    emptyForm: TForm;
    fields: ContentField<TForm>[];
    mapItemToForm: (item: TItem) => TForm;
    buildPayload: (form: TForm) => any;
    getTitle: (item: TItem) => string;
    getSubtitle: (item: TItem) => string;
    getDescription?: (item: TItem) => string | null | undefined;
    getMeta?: (item: TItem) => string;
    getTags?: (item: TItem) => string[];
    sortItems?: (items: TItem[]) => TItem[];
};

const inputClass =
    'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-[#1c1a1c] outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white';

const labelClass = 'mb-1.5 block text-sm font-semibold text-[#1c1a1c] dark:text-white';

function getErrorMessage(error: unknown, fallback: string) {
    if (error && typeof error === 'object') {
        const parts = ['message', 'details', 'hint', 'code']
            .map((key) => (error as Record<string, unknown>)[key])
            .filter((value): value is string => typeof value === 'string' && value.length > 0);

        if (parts.length > 0) return parts.join(' ');
    }

    return error instanceof Error ? error.message : fallback;
}

function ContentAdminPage<TItem extends { id: string }, TForm extends Record<string, string>>({
    title,
    singularLabel,
    badgeLabel,
    description,
    icon: Icon,
    service,
    emptyForm,
    fields,
    mapItemToForm,
    buildPayload,
    getTitle,
    getSubtitle,
    getDescription,
    getMeta,
    getTags,
    sortItems,
}: ContentAdminPageProps<TItem, TForm>) {
    const [items, setItems] = useState<TItem[]>([]);
    const [form, setForm] = useState<TForm>(emptyForm);
    const [editingItem, setEditingItem] = useState<TItem | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const sortedItems = useMemo(() => (sortItems ? sortItems(items) : items), [items, sortItems]);
    const hasDisplayOrder = fields.some((field) => String(field.name) === 'display_order');

    const fetchItems = async () => {
        setLoading(true);
        setError('');

        try {
            setItems(await service.getAll());
        } catch (fetchError) {
            setError(getErrorMessage(fetchError, `Unable to load ${title.toLowerCase()}.`));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const openCreateModal = () => {
        const nextForm = { ...emptyForm };
        if (hasDisplayOrder) {
            const nextOrder =
                items.length > 0
                    ? Math.max(...items.map((item) => Number((item as Record<string, unknown>).display_order || 0))) + 1
                    : 1;
            (nextForm as Record<string, string>).display_order = String(nextOrder);
        }
        setEditingItem(null);
        setForm(nextForm);
        setModalOpen(true);
    };

    const openEditModal = (item: TItem) => {
        setEditingItem(item);
        setForm(mapItemToForm(item));
        setModalOpen(true);
    };

    const closeModal = () => {
        if (saving) return;
        setModalOpen(false);
        setEditingItem(null);
        setForm(emptyForm);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        try {
            const payload = buildPayload(form);
            if (editingItem) {
                const updated = await service.update(editingItem.id, payload);
                setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
            } else {
                const created = await service.create(payload);
                setItems((current) => [...current, created]);
            }
            closeModal();
        } catch (saveError) {
            setError(getErrorMessage(saveError, `Unable to save ${singularLabel.toLowerCase()}.`));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (item: TItem) => {
        const confirmed = window.confirm(`Delete ${getTitle(item)}?`);
        if (!confirmed) return;

        const previous = items;
        setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
        setError('');

        try {
            await service.delete(item.id);
        } catch (deleteError) {
            setItems(previous);
            setError(getErrorMessage(deleteError, `Unable to delete ${singularLabel.toLowerCase()}.`));
        }
    };

    const updateField = (name: keyof TForm, value: string) => {
        setForm((current) => ({ ...current, [name]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <Icon className="h-3.5 w-3.5" />
                        {badgeLabel}
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-[#1c1a1c] dark:text-white">{title}</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">{description}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                        type="button"
                        onClick={fetchItems}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#1c1a1c] transition hover:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white"
                    >
                        <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-[#1c1a1c] transition hover:bg-emerald-400"
                    >
                        <FiPlus className="h-4 w-4" />
                        Add {singularLabel}
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300">
                    {error}
                </div>
            )}

            <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                <div className="grid grid-cols-[80px_1.4fr_1fr_1fr_auto] gap-4 border-b border-zinc-200 bg-[#f7f7f2] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:border-white/10 dark:bg-white/[0.03]">
                    <span>Order</span>
                    <span>Title</span>
                    <span>Source</span>
                    <span>Meta</span>
                    <span className="text-right">Actions</span>
                </div>

                {loading ? (
                    <div className="space-y-3 p-5">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="h-16 animate-pulse rounded-lg bg-zinc-100 dark:bg-white/10" />
                        ))}
                    </div>
                ) : sortedItems.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-sm font-semibold text-[#1c1a1c] dark:text-white">No {title.toLowerCase()} yet</p>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Create the first entry to publish it.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-white/10">
                        {sortedItems.map((item) => {
                            const order = Number((item as Record<string, unknown>).display_order || 0);
                            const tags = getTags?.(item) || [];
                            return (
                                <article
                                    key={item.id}
                                    className="grid grid-cols-1 gap-4 px-5 py-4 transition hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5 lg:grid-cols-[80px_1.4fr_1fr_1fr_auto] lg:items-center"
                                >
                                    <div>
                                        <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-2 text-sm font-semibold text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                                            {hasDisplayOrder ? order : '-'}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="truncate text-sm font-semibold text-[#1c1a1c] dark:text-white">{getTitle(item)}</h2>
                                        {getDescription?.(item) && (
                                            <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{getDescription(item)}</p>
                                        )}
                                        {tags.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1.5 lg:hidden">
                                                {tags.slice(0, 4).map((tag) => (
                                                    <span key={tag} className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{getSubtitle(item)}</p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{getMeta?.(item) || '-'}</p>
                                    <div className="flex items-center gap-2 lg:justify-end">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(item)}
                                            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:text-emerald-300"
                                        >
                                            <FiEdit2 className="h-4 w-4" />
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item)}
                                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-400/20 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-500/10"
                                        >
                                            <FiTrash2 className="h-4 w-4" />
                                            Delete
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-[#1c1a1c]/55 backdrop-blur-sm"
                        onClick={closeModal}
                        aria-label="Close modal"
                    />
                    <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#1c1a1c]">
                        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-white/10">
                            <div>
                                <h2 className="text-lg font-semibold text-[#1c1a1c] dark:text-white">
                                    {editingItem ? `Edit ${singularLabel}` : `Add ${singularLabel}`}
                                </h2>
                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">This entry updates the public portfolio after save.</p>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-[#1c1a1c] dark:hover:bg-white/10 dark:hover:text-white"
                                aria-label="Close"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                            <div className="grid gap-5 overflow-y-auto p-6 md:grid-cols-2">
                                {fields.map((field) => {
                                    const value = form[field.name] || '';
                                    const fieldId = String(field.name);
                                    const className = field.colSpan === 2 ? 'md:col-span-2' : undefined;

                                    return (
                                        <div key={fieldId} className={className}>
                                            <label htmlFor={fieldId} className={labelClass}>{field.label}</label>
                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    id={fieldId}
                                                    required={field.required}
                                                    rows={6}
                                                    value={value}
                                                    onChange={(event) => updateField(field.name, event.target.value)}
                                                    className={`${inputClass} resize-none leading-6`}
                                                    placeholder={field.placeholder}
                                                />
                                            ) : field.type === 'select' ? (
                                                <select
                                                    id={fieldId}
                                                    required={field.required}
                                                    value={value}
                                                    onChange={(event) => updateField(field.name, event.target.value)}
                                                    className={inputClass}
                                                >
                                                    <option value="">{field.placeholder || `Select ${field.label}`}</option>
                                                    {(field.options || []).map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    id={fieldId}
                                                    type={field.type || 'text'}
                                                    required={field.required}
                                                    min={field.type === 'number' ? '0' : undefined}
                                                    value={value}
                                                    onChange={(event) => updateField(field.name, event.target.value)}
                                                    className={inputClass}
                                                    placeholder={field.placeholder}
                                                />
                                            )}
                                            {field.helper && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{field.helper}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex items-center justify-end gap-3 border-t border-zinc-200 bg-[#f7f7f2] px-6 py-4 dark:border-white/10 dark:bg-white/[0.03]">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-[#1c1a1c] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <FiSave className="h-4 w-4" />
                                    {saving ? 'Saving...' : `Save ${singularLabel}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContentAdminPage;
