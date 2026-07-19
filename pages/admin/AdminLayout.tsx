import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/Logo1.png';
import {
    FiAward,
    FiBook,
    FiBookOpen,
    FiBriefcase,
    FiCalendar,
    FiCode,
    FiExternalLink,
    FiFileText,
    FiFolder,
    FiGrid,
    FiHeart,
    FiHome,
    FiLogOut,
    FiMenu,
    FiMessageSquare,
    FiStar,
    FiX,
} from 'react-icons/fi';

const navGroups = [
    {
        label: 'Overview',
        items: [
            { to: '/admin', icon: FiHome, label: 'Dashboard', end: true },
            { to: '/admin/bookings', icon: FiCalendar, label: 'Bookings' },
            { to: '/admin/messages', icon: FiMessageSquare, label: 'Messages' },
        ],
    },
    {
        label: 'Content',
        items: [
            { to: '/admin/projects', icon: FiFolder, label: 'Projects' },
            { to: '/admin/blogs', icon: FiFileText, label: 'Blogs' },
            { to: '/admin/experiences', icon: FiBriefcase, label: 'Experiences' },
        ],
    },
    {
        label: 'Master Data',
        items: [
            { to: '/admin/project-categories', icon: FiGrid, label: 'Project Categories' },
            { to: '/admin/skills', icon: FiCode, label: 'Skills' },
        ],
    },
    {
        label: 'Credentials',
        items: [
            { to: '/admin/education', icon: FiBookOpen, label: 'Education' },
            { to: '/admin/certificates', icon: FiAward, label: 'Certificates' },
            { to: '/admin/awards', icon: FiStar, label: 'Awards' },
            { to: '/admin/volunteers', icon: FiHeart, label: 'Volunteers' },
            { to: '/admin/tutoring', icon: FiBook, label: 'Tutoring' },
        ],
    },
];

const AdminLayout: React.FC = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const sidebar = (
        <div className="flex h-full flex-col border-r border-zinc-200 bg-[#f7f7f2] text-[#1c1a1c] dark:border-white/10 dark:bg-[#1c1a1c] dark:text-white">
            <div className="flex h-20 items-center justify-between border-b border-zinc-200 px-5 dark:border-white/10">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
                        <img src={logo} alt="PathumLD logo" className="h-8 w-8 object-contain" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">PathumLD</p>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">Portfolio control</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-[#1c1a1c] dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white lg:hidden"
                    aria-label="Close sidebar"
                >
                    <FiX className="h-5 w-5" />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {navGroups.map((group) => (
                    <div key={group.label} className="mb-6">
                        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
                            {group.label}
                        </p>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) =>
                                        `group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                            isActive
                                                ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-zinc-200 dark:bg-white/10 dark:text-emerald-300 dark:ring-white/10'
                                                : 'text-zinc-600 hover:bg-white hover:text-[#1c1a1c] dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white'
                                        }`
                                    }
                                >
                                    <span className="flex min-w-0 items-center gap-3">
                                        <item.icon className="h-4 w-4 shrink-0" />
                                        <span className="truncate">{item.label}</span>
                                    </span>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="border-t border-zinc-200 p-4 dark:border-white/10">
                <div className="mb-3 flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                        PD
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#1c1a1c] dark:text-white">Admin</p>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user?.email}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-400/20 dark:bg-transparent dark:text-red-300 dark:hover:bg-red-500/10"
                >
                    <FiLogOut className="h-4 w-4" />
                    Sign out
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f7f7f2] text-[#1c1a1c] dark:bg-[#1c1a1c] dark:text-white">
            {sidebarOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-[#1c1a1c]/60 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar backdrop"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 transform shadow-xl transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {sidebar}
            </aside>

            <div className="min-h-screen lg:pl-72">
                <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#1c1a1c]/90">
                    <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-lg border border-zinc-200 p-2 text-zinc-600 transition hover:border-zinc-400 hover:text-[#1c1a1c] dark:border-white/10 dark:text-zinc-300 dark:hover:text-white lg:hidden"
                                aria-label="Open sidebar"
                            >
                                <FiMenu className="h-5 w-5" />
                            </button>
                            <div>
                                <p className="text-sm font-semibold text-[#1c1a1c] dark:text-white">Admin Console</p>
                                <p className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">
                                    Manage content, bookings, and portfolio data
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href="https://pathumld.com/"
                                className="hidden items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-[#1c1a1c] transition hover:border-emerald-400 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:text-emerald-300 sm:inline-flex"
                            >
                                View portfolio
                                <FiExternalLink className="h-3.5 w-3.5" />
                            </a>
                            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                Supabase connected
                            </div>
                        </div>
                    </div>
                </header>

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
