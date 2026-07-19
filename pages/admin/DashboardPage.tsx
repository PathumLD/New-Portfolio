import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FiActivity,
    FiAward,
    FiBook,
    FiBookOpen,
    FiBriefcase,
    FiCalendar,
    FiCheckCircle,
    FiCode,
    FiFileText,
    FiFolder,
    FiHeart,
    FiMessageSquare,
    FiRefreshCw,
    FiStar,
} from 'react-icons/fi';
import { supabase } from '../../src/lib/supabase';
import { adminTimeZone, formatBookingInTimeZone } from '../../src/lib/booking-time';
import { bookingsService } from '../../src/services';
import type { Booking } from '../../src/types/database.types';

interface StatCard {
    label: string;
    count: number;
    icon: React.ComponentType<{ className?: string }>;
    to: string;
    accent: string;
    group: 'Content' | 'Profile' | 'Engagement';
}

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState({
        skills: 0,
        projects: 0,
        experiences: 0,
        education: 0,
        volunteers: 0,
        certificates: 0,
        awards: 0,
        tutoringGrades: 0,
        blogs: 0,
        bookings: 0,
        messages: 0,
    });
    const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError('');

            try {
                const safeCount = async (query: PromiseLike<{ count: number | null }>) => {
                    try {
                        return await query;
                    } catch {
                        return { count: 0 };
                    }
                };

                const [
                    { count: skills },
                    { count: projects },
                    { count: experiences },
                    { count: education },
                    { count: volunteers },
                    { count: certificates },
                    { count: awards },
                    { count: tutoringGrades },
                    { count: blogs },
                    { count: bookings },
                    { count: messages },
                    upcoming,
                ] = await Promise.all([
                    safeCount(supabase.from('skills').select('*', { count: 'exact', head: true })),
                    safeCount(supabase.from('projects').select('*', { count: 'exact', head: true })),
                    safeCount(supabase.from('experiences').select('*', { count: 'exact', head: true })),
                    safeCount(supabase.from('education').select('*', { count: 'exact', head: true })),
                    safeCount(supabase.from('volunteers').select('*', { count: 'exact', head: true })),
                    safeCount(supabase.from('certificates').select('*', { count: 'exact', head: true })),
                    safeCount(supabase.from('awards').select('*', { count: 'exact', head: true })),
                    safeCount(supabase.from('tutoring_grades').select('*', { count: 'exact', head: true })),
                    safeCount(supabase.from('blogs').select('*', { count: 'exact', head: true })),
                    safeCount(supabase.from('bookings').select('*', { count: 'exact', head: true })),
                    safeCount(supabase.from('contact_messages').select('*', { count: 'exact', head: true })),
                    bookingsService.getUpcoming(5).catch(() => []),
                ]);

                setStats({
                    skills: skills || 0,
                    projects: projects || 0,
                    experiences: experiences || 0,
                    education: education || 0,
                    volunteers: volunteers || 0,
                    certificates: certificates || 0,
                    awards: awards || 0,
                    tutoringGrades: tutoringGrades || 0,
                    blogs: blogs || 0,
                    bookings: bookings || 0,
                    messages: messages || 0,
                });
                setUpcomingBookings(upcoming);
            } catch (fetchError) {
                console.error('Error fetching stats:', fetchError);
                setError(fetchError instanceof Error ? fetchError.message : 'Unable to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards: StatCard[] = [
        { label: 'Projects', count: stats.projects, icon: FiFolder, to: '/admin/projects', accent: 'bg-emerald-500', group: 'Content' },
        { label: 'Blogs', count: stats.blogs, icon: FiFileText, to: '/admin/blogs', accent: 'bg-cyan-500', group: 'Content' },
        { label: 'Skills', count: stats.skills, icon: FiCode, to: '/admin/skills', accent: 'bg-violet-500', group: 'Content' },
        { label: 'Bookings', count: stats.bookings, icon: FiCalendar, to: '/admin/bookings', accent: 'bg-amber-500', group: 'Engagement' },
        { label: 'Messages', count: stats.messages, icon: FiMessageSquare, to: '/admin/messages', accent: 'bg-teal-500', group: 'Engagement' },
        { label: 'Experiences', count: stats.experiences, icon: FiBriefcase, to: '/admin/experiences', accent: 'bg-blue-500', group: 'Profile' },
        { label: 'Education', count: stats.education, icon: FiBookOpen, to: '/admin/education', accent: 'bg-lime-500', group: 'Profile' },
        { label: 'Certificates', count: stats.certificates, icon: FiAward, to: '/admin/certificates', accent: 'bg-teal-500', group: 'Profile' },
        { label: 'Awards', count: stats.awards, icon: FiStar, to: '/admin/awards', accent: 'bg-orange-500', group: 'Profile' },
        { label: 'Volunteers', count: stats.volunteers, icon: FiHeart, to: '/admin/volunteers', accent: 'bg-rose-500', group: 'Profile' },
        { label: 'Tutoring', count: stats.tutoringGrades, icon: FiBook, to: '/admin/tutoring', accent: 'bg-sky-500', group: 'Content' },
    ];

    const totals = useMemo(() => {
        const content = stats.projects + stats.blogs + stats.skills + stats.tutoringGrades;
        const profile = stats.experiences + stats.education + stats.certificates + stats.awards + stats.volunteers;
        return {
            content,
            profile,
            engagement: stats.bookings + stats.messages,
            total: content + profile + stats.bookings + stats.messages,
        };
    }, [stats]);

    const primaryStats = statCards.slice(0, 4);
    const secondaryStats = statCards.slice(4);

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                <div className="grid gap-6 p-6 lg:grid-cols-[1fr_420px] lg:p-8">
                    <div>
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300">
                            <FiActivity className="h-3.5 w-3.5" />
                            Live portfolio administration
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight text-[#1c1a1c] dark:text-white sm:text-4xl">Dashboard</h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                            Manage portfolio content, review booking requests, and keep public pages in sync with Supabase.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 rounded-lg border border-zinc-200 bg-[#f7f7f2] p-3 dark:border-white/10 dark:bg-white/[0.04]">
                        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-white/[0.06]">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Content</p>
                            <p className="mt-2 text-2xl font-semibold text-[#1c1a1c] dark:text-white">{loading ? '-' : totals.content}</p>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-white/[0.06]">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Profile</p>
                            <p className="mt-2 text-2xl font-semibold text-[#1c1a1c] dark:text-white">{loading ? '-' : totals.profile}</p>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-white/[0.06]">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Engagement</p>
                            <p className="mt-2 text-2xl font-semibold text-[#1c1a1c] dark:text-white">{loading ? '-' : totals.engagement}</p>
                        </div>
                    </div>
                </div>
            </section>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300">
                    {error}
                </div>
            )}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {primaryStats.map((card) => (
                    <Link
                        key={card.label}
                        to={card.to}
                        className="group rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{card.label}</p>
                                <p className="mt-3 text-4xl font-semibold tracking-tight text-[#1c1a1c] dark:text-white">
                                    {loading ? <span className="inline-block h-9 w-14 animate-pulse rounded bg-zinc-100 dark:bg-white/10" /> : card.count}
                                </p>
                            </div>
                            <div className={`flex h-11 w-11 items-center justify-center rounded-lg text-white ${card.accent}`}>
                                <card.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 text-sm dark:border-white/10">
                            <span className="font-medium text-zinc-600 dark:text-zinc-300">{card.group}</span>
                            <span className="font-semibold text-emerald-600 transition group-hover:text-emerald-700 dark:text-emerald-300">
                                Manage
                            </span>
                        </div>
                    </Link>
                ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_420px]">
                <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-white/10">
                        <div>
                            <h2 className="text-base font-semibold text-[#1c1a1c] dark:text-white">Content Inventory</h2>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">All editable sections in one view</p>
                        </div>
                        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:bg-white/10 dark:text-zinc-300">
                            {loading ? '-' : totals.total} records
                        </span>
                    </div>
                    <div className="divide-y divide-zinc-100 dark:divide-white/10">
                        {secondaryStats.map((item) => (
                            <Link
                                key={item.label}
                                to={item.to}
                                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 transition hover:bg-zinc-50 dark:hover:bg-white/[0.03]"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white ${item.accent}`}>
                                        <item.icon className="h-4 w-4" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-[#1c1a1c] dark:text-white">{item.label}</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.group}</p>
                                    </div>
                                </div>
                                <span className="text-lg font-semibold text-[#1c1a1c] dark:text-white">
                                    {loading ? '-' : item.count}
                                </span>
                                <span className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:border-white/10 dark:text-zinc-300">
                                    Open
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-white/10">
                        <div>
                            <h2 className="text-base font-semibold text-[#1c1a1c] dark:text-white">Upcoming Bookings</h2>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Discovery calls from contact page</p>
                        </div>
                        <Link to="/admin/bookings" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-300">
                            View all
                        </Link>
                    </div>
                    <div className="p-4">
                        {loading ? (
                            <div className="h-32 animate-pulse rounded-lg bg-zinc-100 dark:bg-white/10" />
                        ) : upcomingBookings.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-zinc-200 p-6 text-center dark:border-white/10">
                                <FiCheckCircle className="mx-auto h-8 w-8 text-emerald-500" />
                                <p className="mt-3 text-sm font-semibold text-[#1c1a1c] dark:text-white">No upcoming bookings</p>
                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">New requests will appear here.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {upcomingBookings.map((booking) => {
                                    const adminDateTime = formatBookingInTimeZone(booking, adminTimeZone);

                                    return (
                                        <Link
                                            key={booking.id}
                                            to="/admin/bookings"
                                            className="block rounded-lg border border-zinc-200 p-4 transition hover:border-emerald-400 dark:border-white/10"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-[#1c1a1c] dark:text-white">{booking.client_name}</p>
                                                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                                        {adminDateTime.date} at {adminDateTime.time} {adminTimeZone}
                                                    </p>
                                                </div>
                                                <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-[11px] font-semibold capitalize text-amber-700 dark:text-amber-300">
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-base font-semibold text-[#1c1a1c] dark:text-white">Quick Actions</h2>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Jump into the pages you update most often</p>
                    </div>
                    <FiRefreshCw className="h-4 w-4 text-zinc-400" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { to: '/admin/projects', label: 'Manage Projects', icon: FiFolder },
                        { to: '/admin/blogs', label: 'Manage Blogs', icon: FiFileText },
                        { to: '/admin/bookings', label: 'Review Bookings', icon: FiCalendar },
                        { to: '/admin/messages', label: 'Review Messages', icon: FiMessageSquare },
                    ].map((action) => (
                        <Link
                            key={action.to}
                            to={action.to}
                            className="flex items-center gap-3 rounded-lg border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
                        >
                            <action.icon className="h-4 w-4" />
                            {action.label}
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default DashboardPage;
