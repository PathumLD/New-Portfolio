import React, { useEffect, useState } from 'react';
import { FiExternalLink, FiSend, FiX } from 'react-icons/fi';
import { emailService, type ReplyType } from '../../src/services';

interface ReplyModalProps {
    isOpen: boolean;
    type: ReplyType;
    recipientName: string;
    recipientEmail: string;
    onClose: () => void;
    onSent?: () => void;
}

const subjectByType: Record<ReplyType, string> = {
    booking: 'Booking Confirmed',
    message: 'Order Confirmed',
};

const ReplyModal: React.FC<ReplyModalProps> = ({
    isOpen,
    type,
    recipientName,
    recipientEmail,
    onClose,
    onSent,
}) => {
    const [message, setMessage] = useState('');
    const [link, setLink] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    // Reset the form whenever the modal opens for a new recipient.
    useEffect(() => {
        if (isOpen) {
            setMessage('');
            setLink('');
            setError('');
            setSending(false);
        }
    }, [isOpen, recipientEmail]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!message.trim()) {
            setError('Please write a message.');
            return;
        }

        setSending(true);
        setError('');

        try {
            await emailService.sendReply({
                type,
                to: recipientEmail,
                name: recipientName,
                message: message.trim(),
                link: link.trim() || undefined,
            });
            onSent?.();
            onClose();
        } catch (sendError) {
            setError(sendError instanceof Error ? sendError.message : 'Unable to send email.');
        } finally {
            setSending(false);
        }
    };

    const linkLabel = type === 'booking' ? 'Meeting link' : 'Link';
    const linkPlaceholder = type === 'booking'
        ? 'https://meet.google.com/...'
        : 'https://...';

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-dark-background">
                <div className="flex items-center justify-between border-b border-black/10 p-5 dark:border-white/10">
                    <div>
                        <h2 className="text-lg font-semibold text-[#1c1a1c] dark:text-white">Reply by email</h2>
                        <p className="mt-0.5 text-xs font-medium text-[#1c1a1c]/50 dark:text-white/50">
                            Subject: {subjectByType[type]}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-lg p-2 text-[#1c1a1c]/50 transition hover:bg-black/5 hover:text-[#1c1a1c] dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                    <div className="space-y-4 overflow-y-auto p-5">
                        {error && (
                            <div className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-700 dark:text-red-300">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#1c1a1c]/40 dark:text-white/40">
                                To
                            </label>
                            <div className="rounded-lg border border-black/10 bg-gray-50 px-3 py-2 text-sm text-[#1c1a1c]/80 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                                {recipientName ? `${recipientName} · ` : ''}{recipientEmail}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="reply-message" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#1c1a1c]/40 dark:text-white/40">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="reply-message"
                                value={message}
                                onChange={(event) => setMessage(event.target.value)}
                                rows={6}
                                required
                                placeholder="Write your reply to the client..."
                                className="w-full resize-none rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-[#1c1a1c] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
                            />
                        </div>

                        <div>
                            <label htmlFor="reply-link" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#1c1a1c]/40 dark:text-white/40">
                                {linkLabel} <span className="font-normal normal-case text-[#1c1a1c]/40 dark:text-white/40">(optional)</span>
                            </label>
                            <div className="relative">
                                <FiExternalLink className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1c1a1c]/30 dark:text-white/30" />
                                <input
                                    id="reply-link"
                                    type="url"
                                    value={link}
                                    onChange={(event) => setLink(event.target.value)}
                                    placeholder={linkPlaceholder}
                                    className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 pl-9 text-sm text-[#1c1a1c] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-black/10 p-5 dark:border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-[#1c1a1c]/60 transition hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={sending}
                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <FiSend className={`h-4 w-4 ${sending ? 'animate-pulse' : ''}`} />
                            {sending ? 'Sending...' : 'Send email'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReplyModal;
