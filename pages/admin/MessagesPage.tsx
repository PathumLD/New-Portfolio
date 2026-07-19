import React, { useEffect, useMemo, useState } from 'react';
import {
    FiArrowLeft,
    FiDownload,
    FiFile,
    FiFileText,
    FiInbox,
    FiMail,
    FiMaximize2,
    FiMessageSquare,
    FiPaperclip,
    FiPhone,
    FiRefreshCw,
    FiSend,
    FiTrash2,
    FiX,
} from 'react-icons/fi';
import { contactMessagesService } from '../../src/services';
import ReplyModal from '../../components/admin/ReplyModal';
import type { ContactMessage, ContactMessageStatus } from '../../src/types/database.types';

const statusOptions: ContactMessageStatus[] = ['new', 'reviewed', 'archived'];

const statusStyles: Record<ContactMessageStatus, string> = {
    new: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    reviewed: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    archived: 'border-zinc-500/25 bg-zinc-500/10 text-zinc-700 dark:text-zinc-300',
};

const statusDot: Record<ContactMessageStatus, string> = {
    new: 'bg-emerald-500',
    reviewed: 'bg-cyan-500',
    archived: 'bg-zinc-400',
};

function formatDate(date: string) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

function formatRelativeDate(date: string) {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
    }).format(new Date(date));
}

function formatFileSize(size: number | null) {
    if (!size || size <= 0) return 'Unknown size';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function isPdfAttachment(message: ContactMessage) {
    return (
        message.attachment_type === 'application/pdf'
        || (message.attachment_name?.toLowerCase().endsWith('.pdf') ?? false)
    );
}

const MessagesPage: React.FC = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState('');
    const [error, setError] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [replyMessage, setReplyMessage] = useState<ContactMessage | null>(null);

    // Inline attachment preview state.
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState('');
    const [fullScreenPreview, setFullScreenPreview] = useState(false);

    const fetchMessages = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await contactMessagesService.getAll();
            setMessages(data);
            setSelectedId((current) => current ?? data[0]?.id ?? null);
        } catch (fetchError) {
            setError(fetchError instanceof Error ? fetchError.message : 'Unable to load messages.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const selectedMessage = useMemo(
        () => messages.find((message) => message.id === selectedId) ?? null,
        [messages, selectedId],
    );

    // Load an inline preview URL whenever a message with a PDF attachment is selected.
    useEffect(() => {
        let cancelled = false;
        setPreviewUrl(null);
        setPreviewError('');

        if (!selectedMessage || !selectedMessage.attachment_path || !isPdfAttachment(selectedMessage)) {
            return;
        }

        setPreviewLoading(true);
        contactMessagesService
            .createAttachmentPreviewUrl(selectedMessage)
            .then((url) => {
                if (!cancelled) setPreviewUrl(url);
            })
            .catch((err) => {
                if (!cancelled) setPreviewError(err instanceof Error ? err.message : 'Unable to load preview.');
            })
            .finally(() => {
                if (!cancelled) setPreviewLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [selectedMessage]);

    const handleStatusChange = async (message: ContactMessage, status: ContactMessageStatus) => {
        const previousMessages = messages;
        setMessages((items) => items.map((item) => (item.id === message.id ? { ...item, status } : item)));

        try {
            await contactMessagesService.updateStatus(message.id, status);
        } catch (updateError) {
            setMessages(previousMessages);
            setError(updateError instanceof Error ? updateError.message : 'Unable to update message status.');
        }
    };

    const handleDownload = async (message: ContactMessage) => {
        setDownloadingId(message.id);
        setError('');

        try {
            const url = await contactMessagesService.createAttachmentDownloadUrl(message);
            if (!url) return;
            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (downloadError) {
            setError(downloadError instanceof Error ? downloadError.message : 'Unable to download attachment.');
        } finally {
            setDownloadingId('');
        }
    };

    const handleDelete = async (message: ContactMessage) => {
        const confirmed = window.confirm(`Delete message from ${message.name}?`);
        if (!confirmed) return;

        const previousMessages = messages;
        const remaining = messages.filter((item) => item.id !== message.id);
        setMessages(remaining);
        if (selectedId === message.id) {
            setSelectedId(remaining[0]?.id ?? null);
        }

        try {
            await contactMessagesService.delete(message);
        } catch (deleteError) {
            setMessages(previousMessages);
            setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete message.');
        }
    };

    const newCount = messages.filter((message) => message.status === 'new').length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1c1a1c] dark:text-white">Messages</h1>
                    <p className="mt-1 text-[#1c1a1c]/60 dark:text-white/60">
                        Contact form submissions and uploaded project briefs
                    </p>
                </div>
                <button
                    type="button"
                    onClick={fetchMessages}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-[#1c1a1c] transition hover:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                    <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-700 dark:text-red-300">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_400px]">
                    <div className="h-[560px] animate-pulse rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/5" />
                    <div className="hidden h-[560px] animate-pulse rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/5 xl:block" />
                    <div className="hidden h-[560px] animate-pulse rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/5 xl:block" />
                </div>
            ) : messages.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-xl border border-black/10 bg-white p-16 text-center text-[#1c1a1c]/60 dark:border-white/10 dark:bg-dark-background dark:text-white/60">
                    <FiInbox className="h-10 w-10 text-[#1c1a1c]/25 dark:text-white/25" />
                    No messages yet.
                </div>
            ) : (
                <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_400px]">
                    {/* Pane 1: inbox list */}
                    <aside
                        className={`${selectedMessage ? 'hidden xl:block' : 'block'} self-start rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-dark-background`}
                    >
                        <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 dark:border-white/10">
                            <span className="text-sm font-semibold text-[#1c1a1c] dark:text-white">Inbox</span>
                            {newCount > 0 && (
                                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                    {newCount} new
                                </span>
                            )}
                        </div>
                        <div className="max-h-[70vh] overflow-y-auto xl:max-h-[640px]">
                            {messages.map((message) => {
                                const active = message.id === selectedId;
                                return (
                                    <button
                                        key={message.id}
                                        type="button"
                                        onClick={() => setSelectedId(message.id)}
                                        className={`flex w-full items-start gap-3 border-b border-black/5 px-4 py-3 text-left transition last:border-b-0 dark:border-white/5 ${
                                            active
                                                ? 'bg-emerald-500/10'
                                                : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${message.status === 'new' ? statusDot.new : 'bg-transparent'}`} />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className={`truncate text-sm ${message.status === 'new' ? 'font-bold text-[#1c1a1c] dark:text-white' : 'font-semibold text-[#1c1a1c]/80 dark:text-white/80'}`}>
                                                    {message.name}
                                                </span>
                                                <span className="shrink-0 text-[11px] font-medium text-[#1c1a1c]/40 dark:text-white/40">
                                                    {formatRelativeDate(message.created_at)}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 truncate text-xs font-medium text-[#1c1a1c]/55 dark:text-white/55">
                                                {message.hiring_reason}
                                            </p>
                                            <p className="mt-0.5 truncate text-xs text-[#1c1a1c]/45 dark:text-white/45">
                                                {message.project_details}
                                            </p>
                                            {message.attachment_path && (
                                                <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-300">
                                                    <FiPaperclip className="h-3 w-3" /> PDF
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Pane 2: message details */}
                    <section
                        className={`${selectedMessage ? 'block' : 'hidden xl:block'} self-start rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-dark-background`}
                    >
                        {selectedMessage ? (
                            <MessageDetail
                                message={selectedMessage}
                                onBack={() => setSelectedId(null)}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                                onReply={() => setReplyMessage(selectedMessage)}
                            />
                        ) : (
                            <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-3 p-10 text-center text-[#1c1a1c]/50 dark:text-white/50">
                                <FiMail className="h-10 w-10 text-[#1c1a1c]/20 dark:text-white/20" />
                                Select a message to read it.
                            </div>
                        )}
                    </section>

                    {/* Pane 3: attachment preview */}
                    <aside
                        className={`${selectedMessage ? 'block' : 'hidden xl:block'} self-start rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-dark-background`}
                    >
                        <AttachmentPanel
                            message={selectedMessage}
                            previewUrl={previewUrl}
                            previewLoading={previewLoading}
                            previewError={previewError}
                            downloading={selectedMessage ? downloadingId === selectedMessage.id : false}
                            onDownload={handleDownload}
                            onFullScreen={() => setFullScreenPreview(true)}
                        />
                    </aside>
                </div>
            )}

            {/* Full-screen PDF preview */}
            {fullScreenPreview && previewUrl && (
                <div className="fixed inset-0 z-50 flex flex-col bg-black/70 p-4 backdrop-blur-sm">
                    <div className="mx-auto flex w-full max-w-5xl items-center justify-between py-2">
                        <span className="truncate text-sm font-semibold text-white">
                            {selectedMessage?.attachment_name || 'Attachment'}
                        </span>
                        <button
                            type="button"
                            onClick={() => setFullScreenPreview(false)}
                            className="rounded-lg bg-white/10 p-2 text-white transition hover:bg-white/20"
                            aria-label="Close preview"
                        >
                            <FiX className="h-5 w-5" />
                        </button>
                    </div>
                    <iframe
                        title="Attachment preview"
                        src={previewUrl}
                        className="mx-auto w-full max-w-5xl flex-1 rounded-lg bg-white"
                    />
                </div>
            )}

            {/* Reply email modal */}
            <ReplyModal
                isOpen={Boolean(replyMessage)}
                type="message"
                recipientName={replyMessage?.name ?? ''}
                recipientEmail={replyMessage?.email ?? ''}
                onClose={() => setReplyMessage(null)}
                onSent={() => {
                    if (replyMessage && replyMessage.status === 'new') {
                        handleStatusChange(replyMessage, 'reviewed');
                    }
                }}
            />
        </div>
    );
};

const MessageDetail: React.FC<{
    message: ContactMessage;
    onBack: () => void;
    onStatusChange: (message: ContactMessage, status: ContactMessageStatus) => void;
    onDelete: (message: ContactMessage) => void;
    onReply: () => void;
}> = ({ message, onBack, onStatusChange, onDelete, onReply }) => {
    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex flex-col gap-3 border-b border-black/10 p-5 dark:border-white/10">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={onBack}
                        aria-label="Back to inbox"
                        className="rounded-lg p-2 text-[#1c1a1c]/60 transition hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10 xl:hidden"
                    >
                        <FiArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                        {message.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate text-lg font-semibold text-[#1c1a1c] dark:text-white">{message.name}</h2>
                            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusStyles[message.status]}`}>
                                {message.status}
                            </span>
                        </div>
                        <p className="text-xs font-medium text-[#1c1a1c]/45 dark:text-white/45">
                            {formatDate(message.created_at)}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={onReply}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                        <FiSend className="h-4 w-4" />
                        Reply
                    </button>
                    <select
                        value={message.status}
                        onChange={(event) => onStatusChange(message, event.target.value as ContactMessageStatus)}
                        className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-semibold text-[#1c1a1c] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-900 dark:text-white"
                    >
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() => onDelete(message)}
                        className="ml-auto inline-flex items-center gap-2 rounded-lg border border-red-500/25 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 dark:text-red-300"
                    >
                        <FiTrash2 className="h-4 w-4" />
                        Delete
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-5 overflow-y-auto p-5 xl:max-h-[560px]">
                <div className="grid gap-3 text-sm text-[#1c1a1c]/80 dark:text-white/80 sm:grid-cols-2">
                    <a href={`mailto:${message.email}`} className="inline-flex min-w-0 items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-300">
                        <FiMail className="h-4 w-4 shrink-0 text-emerald-500" />
                        <span className="truncate">{message.email}</span>
                    </a>
                    <a href={`tel:${message.phone}`} className="inline-flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-300">
                        <FiPhone className="h-4 w-4 shrink-0 text-cyan-500" />
                        {message.phone}
                    </a>
                    <span className="inline-flex min-w-0 items-center gap-2 sm:col-span-2">
                        <FiMessageSquare className="h-4 w-4 shrink-0 text-amber-500" />
                        <span className="truncate">{message.hiring_reason}</span>
                    </span>
                </div>

                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#1c1a1c]/40 dark:text-white/40">Message</p>
                    <p className="whitespace-pre-line rounded-lg bg-gray-50 p-4 text-sm leading-6 text-[#1c1a1c]/75 dark:bg-white/5 dark:text-white/75">
                        {message.project_details}
                    </p>
                </div>
            </div>
        </div>
    );
};

const AttachmentPanel: React.FC<{
    message: ContactMessage | null;
    previewUrl: string | null;
    previewLoading: boolean;
    previewError: string;
    downloading: boolean;
    onDownload: (message: ContactMessage) => void;
    onFullScreen: () => void;
}> = ({ message, previewUrl, previewLoading, previewError, downloading, onDownload, onFullScreen }) => {
    const hasAttachment = Boolean(message?.attachment_path);
    const canPreview = Boolean(message && hasAttachment && isPdfAttachment(message));

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b border-black/10 px-4 py-3 dark:border-white/10">
                <FiPaperclip className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-semibold text-[#1c1a1c] dark:text-white">Attachment</span>
            </div>

            {!message || !hasAttachment ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 p-10 text-center text-sm text-[#1c1a1c]/45 dark:text-white/45">
                    <FiFile className="h-9 w-9 text-[#1c1a1c]/20 dark:text-white/20" />
                    {message ? 'No attachment on this message.' : 'Select a message.'}
                </div>
            ) : (
                <div className="flex flex-1 flex-col p-4">
                    {/* File meta + actions */}
                    <div className="mb-3 flex items-center gap-3">
                        <FiFileText className="h-9 w-9 shrink-0 text-emerald-500" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[#1c1a1c] dark:text-white">
                                {message.attachment_name || 'Attachment'}
                            </p>
                            <p className="text-xs text-[#1c1a1c]/50 dark:text-white/50">
                                {formatFileSize(message.attachment_size)} · {message.attachment_type || 'Unknown type'}
                            </p>
                        </div>
                    </div>

                    <div className="mb-3 flex items-center gap-2">
                        {canPreview && previewUrl && (
                            <button
                                type="button"
                                onClick={onFullScreen}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-2.5 py-1.5 text-xs font-semibold text-[#1c1a1c]/70 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-white/10 dark:text-white/70 dark:hover:text-emerald-300"
                            >
                                <FiMaximize2 className="h-3.5 w-3.5" />
                                Full screen
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => onDownload(message)}
                            disabled={downloading}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/25 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-500/10 disabled:opacity-60 dark:text-emerald-300"
                        >
                            <FiDownload className="h-3.5 w-3.5" />
                            {downloading ? 'Preparing...' : 'Download'}
                        </button>
                    </div>

                    {/* Inline preview */}
                    <div className="flex-1 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
                        {canPreview ? (
                            previewLoading ? (
                                <div className="flex h-full min-h-[400px] items-center justify-center bg-gray-50 text-sm text-[#1c1a1c]/50 dark:bg-white/5 dark:text-white/50">
                                    Loading preview...
                                </div>
                            ) : previewError ? (
                                <div className="flex h-full min-h-[120px] items-center justify-center bg-gray-50 px-4 text-center text-sm text-red-600 dark:bg-white/5 dark:text-red-300">
                                    {previewError}
                                </div>
                            ) : previewUrl ? (
                                <iframe
                                    title="Attachment preview"
                                    src={previewUrl}
                                    className="h-full min-h-[520px] w-full bg-white"
                                />
                            ) : null
                        ) : (
                            <div className="flex h-full min-h-[120px] items-center justify-center bg-gray-50 px-4 text-center text-sm text-[#1c1a1c]/50 dark:bg-white/5 dark:text-white/50">
                                Inline preview is only available for PDF files. Use Download to open this file.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessagesPage;
