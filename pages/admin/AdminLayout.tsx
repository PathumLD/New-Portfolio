import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    FiHome,
    FiCode,
    FiFolder,
    FiBriefcase,
    FiBookOpen,
    FiHeart,
    FiAward,
    FiStar,
    FiBook,
    FiFileText,
    FiLogOut,
    FiMenu,
    FiX,
} from 'react-icons/fi';

const AdminLayout: React.FC = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    const navItems = [
        { to: '/admin', icon: FiHome, label: 'Dashboard', end: true },
        { to: '/admin/skills', icon: FiCode, label: 'Skills' },
        { to: '/admin/projects', icon: FiFolder, label: 'Projects' },
        { to: '/admin/experiences', icon: FiBriefcase, label: 'Experiences' },
        { to: '/admin/education', icon: FiBookOpen, label: 'Education' },
        { to: '/admin/volunteers', icon: FiHeart, label: 'Volunteers' },
        { to: '/admin/certificates', icon: FiAward, label: 'Certificates' },
        { to: '/admin/awards', icon: FiStar, label: 'Awards' },
        { to: '/admin/tutoring', icon: FiBook, label: 'Tutoring' },
        { to: '/admin/blogs', icon: FiFileText, label: 'Blogs' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-background flex">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
                            Admin Panel
                        </h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* User info & logout */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="mb-3 text-sm text-gray-500 dark:text-gray-400 truncate">
                            {user?.email}
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <FiLogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="bg-white dark:bg-gray-900 shadow-sm lg:hidden">
                    <div className="flex items-center justify-between p-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <FiMenu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                            Admin Panel
                        </h1>
                        <div className="w-10" /> {/* Spacer */}
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
