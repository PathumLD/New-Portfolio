import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FiCode,
    FiFolder,
    FiBriefcase,
    FiBookOpen,
    FiHeart,
    FiAward,
    FiStar,
    FiBook,
    FiFileText,
    FiTrendingUp,
} from 'react-icons/fi';
import { supabase } from '../../src/lib/supabase';

interface StatCard {
    label: string;
    count: number;
    icon: React.ComponentType<{ className?: string }>;
    to: string;
    color: string;
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
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
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
                ] = await Promise.all([
                    supabase.from('skills').select('*', { count: 'exact', head: true }),
                    supabase.from('projects').select('*', { count: 'exact', head: true }),
                    supabase.from('experiences').select('*', { count: 'exact', head: true }),
                    supabase.from('education').select('*', { count: 'exact', head: true }),
                    supabase.from('volunteers').select('*', { count: 'exact', head: true }),
                    supabase.from('certificates').select('*', { count: 'exact', head: true }),
                    supabase.from('awards').select('*', { count: 'exact', head: true }),
                    supabase.from('tutoring_grades').select('*', { count: 'exact', head: true }),
                    supabase.from('blogs').select('*', { count: 'exact', head: true }),
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
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards: StatCard[] = [
        { label: 'Skills', count: stats.skills, icon: FiCode, to: '/admin/skills', color: 'bg-emerald-500' },
        { label: 'Projects', count: stats.projects, icon: FiFolder, to: '/admin/projects', color: 'bg-green-500' },
        { label: 'Experiences', count: stats.experiences, icon: FiBriefcase, to: '/admin/experiences', color: 'bg-green-500' },
        { label: 'Education', count: stats.education, icon: FiBookOpen, to: '/admin/education', color: 'bg-yellow-500' },
        { label: 'Volunteers', count: stats.volunteers, icon: FiHeart, to: '/admin/volunteers', color: 'bg-lime-500' },
        { label: 'Certificates', count: stats.certificates, icon: FiAward, to: '/admin/certificates', color: 'bg-teal-500' },
        { label: 'Awards', count: stats.awards, icon: FiStar, to: '/admin/awards', color: 'bg-orange-500' },
        { label: 'Tutoring Grades', count: stats.tutoringGrades, icon: FiBook, to: '/admin/tutoring', color: 'bg-emerald-600' },
        { label: 'Blogs', count: stats.blogs, icon: FiFileText, to: '/admin/blogs', color: 'bg-green-600' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#1c1a1c] dark:text-white">Dashboard</h1>
                <p className="text-[#1c1a1c]/60 dark:text-white/60 mt-1">
                    Welcome to your portfolio admin dashboard
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((card) => (
                    <Link
                        key={card.label}
                        to={card.to}
                        className="group bg-white dark:bg-dark-background rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-black/10 dark:border-white/10"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[#1c1a1c]/60 dark:text-white/60">
                                        {card.label}
                                    </p>
                                    <p className="text-3xl font-bold text-[#1c1a1c] dark:text-white mt-1">
                                        {loading ? (
                                            <span className="inline-block w-12 h-8 bg-primary-100 dark:bg-primary-900/40 rounded animate-pulse" />
                                        ) : (
                                            card.count
                                        )}
                                    </p>
                                </div>
                                <div
                                    className={`${card.color} p-4 rounded-xl text-white group-hover:scale-110 transition-transform`}
                                >
                                    <card.icon className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                                <span>Manage {card.label}</span>
                                <FiTrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-dark-background rounded-xl shadow-sm p-6 border border-black/10 dark:border-white/10">
                <h2 className="text-xl font-semibold text-[#1c1a1c] dark:text-white mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Link
                        to="/admin/projects"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-black/15 dark:border-white/15 hover:border-green-500 dark:hover:border-green-500 text-[#1c1a1c]/60 dark:text-white/60 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                        <FiFolder className="w-8 h-8" />
                        <span className="text-sm font-medium">Add Project</span>
                    </Link>
                    <Link
                        to="/admin/blogs"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-black/15 dark:border-white/15 hover:border-green-500 dark:hover:border-green-500 text-[#1c1a1c]/60 dark:text-white/60 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                        <FiFileText className="w-8 h-8" />
                        <span className="text-sm font-medium">Add Blog</span>
                    </Link>
                    <Link
                        to="/admin/experiences"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-black/15 dark:border-white/15 hover:border-green-500 dark:hover:border-green-500 text-[#1c1a1c]/60 dark:text-white/60 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                        <FiBriefcase className="w-8 h-8" />
                        <span className="text-sm font-medium">Add Experience</span>
                    </Link>
                    <Link
                        to="/admin/skills"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-black/15 dark:border-white/15 hover:border-green-500 dark:hover:border-green-500 text-[#1c1a1c]/60 dark:text-white/60 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                        <FiCode className="w-8 h-8" />
                        <span className="text-sm font-medium">Add Skill</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;


