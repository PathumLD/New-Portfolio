import React from 'react';
import { Routes, Route, BrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import CredentialsPage from './pages/CredentialsPage';
import CertificationsAwardsPage from './pages/CertificationsAwardsPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';

// Admin pages
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import BookingsPage from './pages/admin/BookingsPage';
import MessagesPage from './pages/admin/MessagesPage';
import ExperiencesPage from './pages/admin/ExperiencesPage';
import ProjectsAdminPage from './pages/admin/ProjectsAdminPage';
import ProjectCategoriesPage from './pages/admin/ProjectCategoriesPage';
import EducationPage from './pages/admin/EducationPage';
import VolunteersPage from './pages/admin/VolunteersPage';
import CertificatesPage from './pages/admin/CertificatesPage';
import AwardsPage from './pages/admin/AwardsPage';

const isAdminHost = () =>
  typeof window !== 'undefined' && window.location.hostname.toLowerCase() === 'admin.pathumld.com';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Public Layout wrapper component
const PublicLayout: React.FC = () => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  if (isAdminHost()) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="site-backdrop relative flex min-h-screen flex-col overflow-x-hidden text-zinc-950 transition-colors duration-300 dark:text-white">
      <div className="grid-overlay pointer-events-none fixed inset-0 -z-10 opacity-70" />
      <div className="ambient-beam pointer-events-none fixed left-1/2 top-[-10rem] -z-10 h-[34rem] w-[70rem] -translate-x-1/2 opacity-80" />
      <div className="ambient-beam pointer-events-none fixed bottom-[-18rem] right-[-18rem] -z-10 h-[42rem] w-[52rem] rotate-12 opacity-50" />
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-white/70 to-transparent dark:from-zinc-950/80" />
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-grow px-4 pb-16 pt-28 sm:px-6 md:pt-32 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18, filter: 'blur(8px)' }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10, filter: 'blur(6px)' }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/credentials" element={<CredentialsPage />} />
              <Route path="/certifications-awards" element={<CertificationsAwardsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Admin Routes - separate layout */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="experiences" element={<ExperiencesPage />} />
              <Route path="projects" element={<ProjectsAdminPage />} />
              <Route path="project-categories" element={<ProjectCategoriesPage />} />
              <Route path="education" element={<EducationPage />} />
              <Route path="volunteers" element={<VolunteersPage />} />
              <Route path="certificates" element={<CertificatesPage />} />
              <Route path="awards" element={<AwardsPage />} />
            </Route>

            {/* Public Routes - with main layout */}
            <Route path="/*" element={<PublicLayout />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
