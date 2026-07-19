import React, { useEffect, useMemo, useState } from 'react';
import { FiBriefcase, FiEdit2, FiPlus, FiRefreshCw, FiSave, FiTrash2, FiX } from 'react-icons/fi';
import { experiencesService } from '../../src/services';
import type { Experience, ExperienceInsert, ExperienceUpdate } from '../../src/types/database.types';

type ExperienceFormState = {
    job_title: string;
    company: string;
    start_date: string;
    end_date: string;
    description: string;
    tags: string;
    display_order: string;
};

const emptyForm: ExperienceFormState = {
    job_title: '',
    company: '',
    start_date: '',
    end_date: '',
    description: '',
    tags: '',
    display_order: '1',
};

const inputClass =
    'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-[#1c1a1c] outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white';

const labelClass = 'mb-1.5 block text-sm font-semibold text-[#1c1a1c] dark:text-white';

function parseTags(value: string) {
    return value
        .split(/[\n,]/)
        .map((tag) => tag.trim())
        .filter(Boolean);
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(`${date}T00:00:00`));
}

function getErrorMessage(error: unknown, fallback: string) {
    if (error && typeof error === 'object') {
        const parts = ['message', 'details', 'hint', 'code']
            .map((key) => (error as Record<string, unknown>)[key])
            .filter((value): value is string => typeof value === 'string' && value.length > 0);

        if (parts.length > 0) {
            return parts.join(' ');
        }
    }

    return error instanceof Error ? error.message : fallback;
}

function mapExperienceToForm(experience: Experience): ExperienceFormState {
    return {
        job_title: experience.job_title,
        company: experience.company,
        start_date: experience.start_date,
        end_date: experience.end_date || '',
        description: experience.description,
        tags: experience.tags.join(', '),
        display_order: String(experience.display_order || 0),
    };
}

const ExperiencesPage: React.FC = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [form, setForm] = useState<ExperienceFormState>(emptyForm);
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const sortedExperiences = useMemo(
        () => [...experiences].sort((a, b) => a.display_order - b.display_order || b.start_date.localeCompare(a.start_date)),
        [experiences]
    );

    const fetchExperiences = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await experiencesService.getAll();
            setExperiences(data);
        } catch (fetchError) {
            setError(getErrorMessage(fetchError, 'Unable to load experiences.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const openCreateModal = () => {
        const nextOrder = experiences.length > 0 ? Math.max(...experiences.map((item) => item.display_order || 0)) + 1 : 1;
        setEditingExperience(null);
        setForm({ ...emptyForm, display_order: String(nextOrder) });
        setModalOpen(true);
    };

    const openEditModal = (experience: Experience) => {
        setEditingExperience(experience);
        setForm(mapExperienceToForm(experience));
        setModalOpen(true);
    };

    const closeModal = () => {
        if (saving) return;
        setModalOpen(false);
        setEditingExperience(null);
        setForm(emptyForm);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        setError('');

        const payload: ExperienceInsert | ExperienceUpdate = {
            job_title: form.job_title.trim(),
            company: form.company.trim(),
            start_date: form.start_date,
            end_date: form.end_date || null,
            description: form.description.trim(),
            tags: parseTags(form.tags),
            display_order: Number(form.display_order || 0),
        };

        try {
            if (editingExperience) {
                const updated = await experiencesService.update(editingExperience.id, payload);
                setExperiences((items) => items.map((item) => (item.id === updated.id ? updated : item)));
            } else {
                const created = await experiencesService.create(payload as ExperienceInsert);
                setExperiences((items) => [...items, created]);
            }
            closeModal();
        } catch (saveError) {
            setError(getErrorMessage(saveError, 'Unable to save experience.'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (experience: Experience) => {
        const confirmed = window.confirm(`Delete ${experience.job_title} at ${experience.company}?`);
        if (!confirmed) return;

        const previous = experiences;
        setExperiences((items) => items.filter((item) => item.id !== experience.id));
        setError('');

        try {
            await experiencesService.delete(experience.id);
        } catch (deleteError) {
            setExperiences(previous);
            setError(getErrorMessage(deleteError, 'Unable to delete experience.'));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <FiBriefcase className="h-3.5 w-3.5" />
                        Credentials section
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight text-[#1c1a1c] dark:text-white">Experiences</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                        Manage the experience timeline shown on the public Credentials page.
                    </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                        type="button"
                        onClick={fetchExperiences}
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
                        Add Experience
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300">
                    {error}
                </div>
            )}

            <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                <div className="grid grid-cols-[80px_1.2fr_1fr_1fr_auto] gap-4 border-b border-zinc-200 bg-[#f7f7f2] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:border-white/10 dark:bg-white/[0.03]">
                    <span>Order</span>
                    <span>Role</span>
                    <span>Company</span>
                    <span>Period</span>
                    <span className="text-right">Actions</span>
                </div>

                {loading ? (
                    <div className="space-y-3 p-5">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="h-16 animate-pulse rounded-lg bg-zinc-100 dark:bg-white/10" />
                        ))}
                    </div>
                ) : sortedExperiences.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-sm font-semibold text-[#1c1a1c] dark:text-white">No experiences yet</p>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Create the first timeline entry to publish it.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100 dark:divide-white/10">
                        {sortedExperiences.map((experience) => (
                            <article
                                key={experience.id}
                                className="grid grid-cols-1 gap-4 px-5 py-4 transition hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5 lg:grid-cols-[80px_1.2fr_1fr_1fr_auto] lg:items-center"
                            >
                                <div>
                                    <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white px-2 text-sm font-semibold text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                                        {experience.display_order}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <h2 className="truncate text-sm font-semibold text-[#1c1a1c] dark:text-white">{experience.job_title}</h2>
                                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{experience.description}</p>
                                    <div className="mt-3 flex flex-wrap gap-1.5 lg:hidden">
                                        {experience.tags.slice(0, 4).map((tag) => (
                                            <span key={tag} className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{experience.company}</p>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {formatDate(experience.start_date)} - {experience.end_date ? formatDate(experience.end_date) : 'Present'}
                                </p>
                                <div className="flex items-center gap-2 lg:justify-end">
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(experience)}
                                        className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:text-emerald-300"
                                    >
                                        <FiEdit2 className="h-4 w-4" />
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(experience)}
                                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-400/20 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-500/10"
                                    >
                                        <FiTrash2 className="h-4 w-4" />
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
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
                                    {editingExperience ? 'Edit Experience' : 'Add Experience'}
                                </h2>
                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">This entry updates the public timeline after save.</p>
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
                                <div>
                                    <label htmlFor="job_title" className={labelClass}>Role / Title</label>
                                    <input
                                        id="job_title"
                                        required
                                        value={form.job_title}
                                        onChange={(event) => setForm((value) => ({ ...value, job_title: event.target.value }))}
                                        className={inputClass}
                                        placeholder="Software Engineer"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="company" className={labelClass}>Company</label>
                                    <input
                                        id="company"
                                        required
                                        value={form.company}
                                        onChange={(event) => setForm((value) => ({ ...value, company: event.target.value }))}
                                        className={inputClass}
                                        placeholder="KodeMargin"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="start_date" className={labelClass}>Start Date</label>
                                    <input
                                        id="start_date"
                                        type="date"
                                        required
                                        value={form.start_date}
                                        onChange={(event) => setForm((value) => ({ ...value, start_date: event.target.value }))}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="end_date" className={labelClass}>End Date</label>
                                    <input
                                        id="end_date"
                                        type="date"
                                        value={form.end_date}
                                        onChange={(event) => setForm((value) => ({ ...value, end_date: event.target.value }))}
                                        className={inputClass}
                                    />
                                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Leave empty for Present.</p>
                                </div>
                                <div>
                                    <label htmlFor="display_order" className={labelClass}>Display Order</label>
                                    <input
                                        id="display_order"
                                        type="number"
                                        min="0"
                                        required
                                        value={form.display_order}
                                        onChange={(event) => setForm((value) => ({ ...value, display_order: event.target.value }))}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="tags" className={labelClass}>Skills / Tags</label>
                                    <input
                                        id="tags"
                                        value={form.tags}
                                        onChange={(event) => setForm((value) => ({ ...value, tags: event.target.value }))}
                                        className={inputClass}
                                        placeholder="React, Node.js, PostgreSQL"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="description" className={labelClass}>Description</label>
                                    <textarea
                                        id="description"
                                        required
                                        rows={6}
                                        value={form.description}
                                        onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))}
                                        className={`${inputClass} resize-none leading-6`}
                                        placeholder="Describe responsibilities, impact, and stack..."
                                    />
                                </div>
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
                                    {saving ? 'Saving...' : 'Save Experience'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExperiencesPage;
