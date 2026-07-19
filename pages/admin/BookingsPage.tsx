import React, { useEffect, useMemo, useState } from 'react';
import {
    FiCalendar,
    FiChevronLeft,
    FiChevronRight,
    FiClock,
    FiMail,
    FiMapPin,
    FiPhone,
    FiRefreshCw,
    FiSend,
    FiTrash2,
    FiX,
} from 'react-icons/fi';
import { bookingsService } from '../../src/services';
import ReplyModal from '../../components/admin/ReplyModal';
import type { Booking, BookingStatus } from '../../src/types/database.types';
import {
    adminTimeZone,
    formatBookingInTimeZone,
    getBookingDateKey,
    getTimeZoneLabel,
    getTodayDateKey,
} from '../../src/lib/booking-time';

const statusOptions: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];

const statusStyles: Record<BookingStatus, string> = {
    pending: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    confirmed: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    completed: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    cancelled: 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300',
};

const statusDot: Record<BookingStatus, string> = {
    pending: 'bg-amber-500',
    confirmed: 'bg-emerald-500',
    completed: 'bg-cyan-500',
    cancelled: 'bg-red-500',
};

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function dateKeyToLabel(dateKey: string) {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(`${dateKey}T00:00:00`));
}

/** Splits the stored "Country: X\n\nDescription: Y" notes into separate fields. */
function parseNotes(notes: string | null) {
    if (!notes) return { country: '', description: '' };

    const countryMatch = notes.match(/Country:\s*([^\n]*)/i);
    let country = countryMatch ? countryMatch[1].trim() : '';

    let description = '';
    const descIndex = notes.search(/Description:/i);
    if (descIndex !== -1) {
        description = notes.slice(descIndex).replace(/Description:\s*/i, '').trim();
    }

    // Handle the inline "Country: X Description: Y" form on a single line.
    const inlineDescIndex = country.search(/Description:/i);
    if (inlineDescIndex !== -1) {
        country = country.slice(0, inlineDescIndex).trim();
    }

    if (!country && !description) description = notes.trim();

    return { country, description };
}

function toDateKey(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/** Builds the 6x7 grid of dates covering the given month. */
function buildCalendarDays(monthStart: Date) {
    const firstDayOfWeek = monthStart.getDay();
    const gridStart = new Date(monthStart);
    gridStart.setDate(monthStart.getDate() - firstDayOfWeek);

    return Array.from({ length: 42 }, (_, index) => {
        const date = new Date(gridStart);
        date.setDate(gridStart.getDate() + index);
        return date;
    });
}

function sortBookings(items: Booking[]) {
    return [...items].sort((a, b) => a.start_time.localeCompare(b.start_time));
}

const BookingsPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [monthStart, setMonthStart] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [replyBooking, setReplyBooking] = useState<Booking | null>(null);

    const todayKey = useMemo(() => getTodayDateKey(adminTimeZone), []);

    const fetchBookings = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await bookingsService.getAll();
            setBookings(data);
        } catch (fetchError) {
            setError(fetchError instanceof Error ? fetchError.message : 'Unable to load bookings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // Group bookings by their admin-timezone calendar date key.
    const bookingsByDay = useMemo(() => {
        const map = new Map<string, Booking[]>();
        bookings.forEach((booking) => {
            const key = getBookingDateKey(booking, adminTimeZone);
            const existing = map.get(key);
            if (existing) {
                existing.push(booking);
            } else {
                map.set(key, [booking]);
            }
        });
        map.forEach((items, key) => map.set(key, sortBookings(items)));
        return map;
    }, [bookings]);

    const todaysBookings = bookingsByDay.get(todayKey) ?? [];
    const selectedDayBookings = selectedDayKey ? bookingsByDay.get(selectedDayKey) ?? [] : [];
    const calendarDays = useMemo(() => buildCalendarDays(monthStart), [monthStart]);

    // Keep the open modals in sync when bookings refresh (status change / delete).
    const syncedSelectedBooking = selectedBooking
        ? bookings.find((item) => item.id === selectedBooking.id) ?? null
        : null;

    const goToMonth = (offset: number) => {
        setMonthStart((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    };

    const goToToday = () => {
        const now = new Date();
        setMonthStart(new Date(now.getFullYear(), now.getMonth(), 1));
    };

    const handleStatusChange = async (booking: Booking, status: BookingStatus) => {
        const previousBookings = bookings;
        setBookings((items) => items.map((item) => (item.id === booking.id ? { ...item, status } : item)));

        try {
            await bookingsService.updateStatus(booking.id, status);
        } catch (updateError) {
            setBookings(previousBookings);
            setError(updateError instanceof Error ? updateError.message : 'Unable to update booking status.');
        }
    };

    const handleDelete = async (booking: Booking) => {
        const confirmed = window.confirm(`Delete booking from ${booking.client_name}?`);
        if (!confirmed) return;

        const previousBookings = bookings;
        setBookings((items) => items.filter((item) => item.id !== booking.id));
        setSelectedBooking(null);

        try {
            await bookingsService.delete(booking.id);
        } catch (deleteError) {
            setBookings(previousBookings);
            setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete booking.');
        }
    };

    const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(monthStart);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1c1a1c] dark:text-white">Bookings</h1>
                    <p className="mt-1 text-[#1c1a1c]/60 dark:text-white/60">
                        Discovery call requests from the portfolio contact page
                    </p>
                </div>
                <button
                    type="button"
                    onClick={fetchBookings}
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

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                {/* Calendar */}
                <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-dark-background sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-semibold text-[#1c1a1c] dark:text-white">{monthLabel}</h2>
                            <button
                                type="button"
                                onClick={goToToday}
                                className="rounded-md border border-black/10 px-2.5 py-1 text-xs font-semibold text-[#1c1a1c]/70 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-white/10 dark:text-white/70 dark:hover:text-emerald-300"
                            >
                                Today
                            </button>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => goToMonth(-1)}
                                aria-label="Previous month"
                                className="rounded-lg border border-black/10 p-2 text-[#1c1a1c]/70 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-white/10 dark:text-white/70 dark:hover:text-emerald-300"
                            >
                                <FiChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => goToMonth(1)}
                                aria-label="Next month"
                                className="rounded-lg border border-black/10 p-2 text-[#1c1a1c]/70 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-white/10 dark:text-white/70 dark:hover:text-emerald-300"
                            >
                                <FiChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wide text-[#1c1a1c]/40 dark:text-white/40">
                        {weekdayLabels.map((label) => (
                            <div key={label} className="py-1">{label}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((date) => {
                            const dateKey = toDateKey(date);
                            const dayBookings = bookingsByDay.get(dateKey) ?? [];
                            const isCurrentMonth = date.getMonth() === monthStart.getMonth();
                            const isToday = dateKey === todayKey;
                            const hasBookings = dayBookings.length > 0;

                            return (
                                <button
                                    key={dateKey}
                                    type="button"
                                    onClick={() => hasBookings && setSelectedDayKey(dateKey)}
                                    disabled={!hasBookings}
                                    className={`group flex min-h-[76px] flex-col rounded-lg border p-1.5 text-left transition sm:min-h-[92px] ${
                                        hasBookings
                                            ? 'cursor-pointer border-black/10 hover:border-emerald-500 hover:shadow-sm dark:border-white/10'
                                            : 'cursor-default border-transparent'
                                    } ${
                                        isToday
                                            ? 'bg-emerald-500/10 ring-1 ring-emerald-500/40'
                                            : hasBookings
                                                ? 'bg-black/[0.015] dark:bg-white/[0.03]'
                                                : ''
                                    }`}
                                >
                                    <span
                                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-sm font-semibold ${
                                            isToday
                                                ? 'bg-emerald-500 text-white'
                                                : isCurrentMonth
                                                    ? 'text-[#1c1a1c] dark:text-white'
                                                    : 'text-[#1c1a1c]/30 dark:text-white/25'
                                        }`}
                                    >
                                        {date.getDate()}
                                    </span>
                                    {hasBookings && (
                                        <div className="mt-1 space-y-0.5 overflow-hidden">
                                            {dayBookings.slice(0, 2).map((booking) => {
                                                const admin = formatBookingInTimeZone(booking, adminTimeZone);
                                                return (
                                                    <div
                                                        key={booking.id}
                                                        className="flex items-center gap-1 truncate rounded bg-black/5 px-1 py-0.5 text-[10px] font-medium text-[#1c1a1c]/70 dark:bg-white/10 dark:text-white/70"
                                                    >
                                                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDot[booking.status]}`} />
                                                        <span className="truncate">{admin.time} {booking.client_name}</span>
                                                    </div>
                                                );
                                            })}
                                            {dayBookings.length > 2 && (
                                                <div className="px-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
                                                    +{dayBookings.length - 2} more
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Today's bookings */}
                <aside className="rounded-xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-dark-background">
                    <div className="flex items-center gap-2">
                        <FiCalendar className="h-5 w-5 text-emerald-500" />
                        <h2 className="text-lg font-semibold text-[#1c1a1c] dark:text-white">Today</h2>
                    </div>
                    <p className="mt-1 text-xs font-medium text-[#1c1a1c]/50 dark:text-white/50">
                        {dateKeyToLabel(todayKey)} ({adminTimeZone})
                    </p>

                    <div className="mt-4 space-y-2">
                        {loading ? (
                            [...Array(3)].map((_, index) => (
                                <div key={index} className="h-16 animate-pulse rounded-lg border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
                            ))
                        ) : todaysBookings.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-black/15 p-6 text-center text-sm text-[#1c1a1c]/50 dark:border-white/15 dark:text-white/50">
                                No bookings today.
                            </div>
                        ) : (
                            todaysBookings.map((booking) => (
                                <BookingRow
                                    key={booking.id}
                                    booking={booking}
                                    onClick={() => setSelectedBooking(booking)}
                                />
                            ))
                        )}
                    </div>
                </aside>
            </div>

            {/* Day bookings modal */}
            {selectedDayKey && (
                <Modal title={dateKeyToLabel(selectedDayKey)} onClose={() => setSelectedDayKey(null)}>
                    <p className="-mt-2 mb-4 text-xs font-medium text-[#1c1a1c]/50 dark:text-white/50">
                        {selectedDayBookings.length} booking{selectedDayBookings.length === 1 ? '' : 's'} ({adminTimeZone})
                    </p>
                    <div className="space-y-2">
                        {selectedDayBookings.map((booking) => (
                            <BookingRow
                                key={booking.id}
                                booking={booking}
                                onClick={() => setSelectedBooking(booking)}
                            />
                        ))}
                    </div>
                </Modal>
            )}

            {/* Booking detail modal */}
            {syncedSelectedBooking && (
                <Modal title={syncedSelectedBooking.client_name} onClose={() => setSelectedBooking(null)}>
                    <BookingDetail
                        booking={syncedSelectedBooking}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        onReply={() => setReplyBooking(syncedSelectedBooking)}
                    />
                </Modal>
            )}

            {/* Reply email modal */}
            <ReplyModal
                isOpen={Boolean(replyBooking)}
                type="booking"
                recipientName={replyBooking?.client_name ?? ''}
                recipientEmail={replyBooking?.client_email ?? ''}
                onClose={() => setReplyBooking(null)}
                onSent={() => {
                    if (replyBooking && replyBooking.status !== 'confirmed') {
                        handleStatusChange(replyBooking, 'confirmed');
                    }
                }}
            />
        </div>
    );
};

const BookingRow: React.FC<{ booking: Booking; onClick: () => void }> = ({ booking, onClick }) => {
    const admin = formatBookingInTimeZone(booking, adminTimeZone);
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-3 rounded-lg border border-black/10 bg-white p-3 text-left transition hover:border-emerald-500 hover:shadow-sm dark:border-white/10 dark:bg-white/5"
        >
            <div className="flex flex-col items-center rounded-md bg-emerald-500/10 px-2.5 py-1.5 text-emerald-700 dark:text-emerald-300">
                <span className="text-sm font-bold leading-none">{admin.time}</span>
                <span className="mt-0.5 text-[10px] font-medium leading-none">{booking.duration_minutes}m</span>
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#1c1a1c] dark:text-white">{booking.client_name}</p>
                <p className="truncate text-xs text-[#1c1a1c]/60 dark:text-white/60">{booking.client_email}</p>
            </div>
            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${statusStyles[booking.status]}`}>
                {booking.status}
            </span>
        </button>
    );
};

const BookingDetail: React.FC<{
    booking: Booking;
    onStatusChange: (booking: Booking, status: BookingStatus) => void;
    onDelete: (booking: Booking) => void;
    onReply: () => void;
}> = ({ booking, onStatusChange, onDelete, onReply }) => {
    const admin = formatBookingInTimeZone(booking, adminTimeZone);
    const { country, description } = parseNotes(booking.notes);

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[booking.status]}`}>
                    {booking.status}
                </span>
                <span className="rounded-full border border-black/10 px-2.5 py-1 text-xs font-semibold capitalize text-[#1c1a1c]/60 dark:border-white/10 dark:text-white/60">
                    {booking.meeting_type.replace(/_/g, ' ')}
                </span>
            </div>

            {/* Date & time */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#1c1a1c]/80 dark:text-white/80">
                <div className="inline-flex items-center gap-2">
                    <FiCalendar className="h-4 w-4 shrink-0 text-emerald-500" />
                    {admin.date}
                </div>
                <div className="inline-flex items-center gap-2">
                    <FiClock className="h-4 w-4 shrink-0 text-cyan-500" />
                    {admin.time} · {booking.duration_minutes} min
                </div>
            </div>

            {/* Contact */}
            <div className="grid gap-2 text-sm text-[#1c1a1c]/80 dark:text-white/80 sm:grid-cols-2">
                <a href={`mailto:${booking.client_email}`} className="inline-flex min-w-0 items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-300">
                    <FiMail className="h-4 w-4 shrink-0 text-amber-500" />
                    <span className="truncate">{booking.client_email}</span>
                </a>
                {booking.client_phone && (
                    <a href={`tel:${booking.client_phone}`} className="inline-flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-300">
                        <FiPhone className="h-4 w-4 shrink-0 text-lime-500" />
                        {booking.client_phone}
                    </a>
                )}
            </div>

            {/* Country */}
            {country && (
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#1c1a1c]/40 dark:text-white/40">Country</p>
                    <p className="inline-flex items-center gap-2 text-sm font-medium text-[#1c1a1c]/80 dark:text-white/80">
                        <FiMapPin className="h-4 w-4 shrink-0 text-emerald-500" />
                        {country}
                    </p>
                </div>
            )}

            {/* Client's original selection */}
            <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-xs font-medium text-[#1c1a1c]/60 dark:bg-white/5 dark:text-white/60">
                User selected <span className="font-semibold text-[#1c1a1c]/80 dark:text-white/80">{booking.start_time}</span> in {getTimeZoneLabel(booking.timezone)}
            </div>

            {/* Description */}
            {description && (
                <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#1c1a1c]/40 dark:text-white/40">Description</p>
                    <p className="whitespace-pre-line rounded-lg bg-gray-50 p-4 text-sm leading-6 text-[#1c1a1c]/70 dark:bg-white/5 dark:text-white/70">
                        {description}
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-3 border-t border-black/10 pt-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-[#1c1a1c]/60 dark:text-white/60" htmlFor={`status-${booking.id}`}>
                        Status
                    </label>
                    <select
                        id={`status-${booking.id}`}
                        value={booking.status}
                        onChange={(event) => onStatusChange(booking, event.target.value as BookingStatus)}
                        className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm font-semibold text-[#1c1a1c] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10 dark:bg-gray-900 dark:text-white"
                    >
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onReply}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                        <FiSend className="h-4 w-4" />
                        Reply
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(booking)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/25 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 dark:text-red-300"
                    >
                        <FiTrash2 className="h-4 w-4" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-dark-background">
                <div className="flex items-center justify-between border-b border-black/10 p-5 dark:border-white/10">
                    <h2 className="text-lg font-semibold text-[#1c1a1c] dark:text-white">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-lg p-2 text-[#1c1a1c]/50 transition hover:bg-black/5 hover:text-[#1c1a1c] dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                </div>
                <div className="overflow-y-auto p-5">{children}</div>
            </div>
        </div>
    );
};

export default BookingsPage;
