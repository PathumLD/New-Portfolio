


import React, { useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import CredentialsPage from './pages/CredentialsPage';
import CertificationsAwardsPage from './pages/CertificationsAwardsPage';
import ContactPage from './pages/ContactPage';
import TutoringPage from './pages/TutoringPage';
import BlogPage from './pages/BlogPage';

const InteractiveAuroraBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const { clientX, clientY } = event;
        const { offsetWidth, offsetHeight } = containerRef.current;
        const x = (clientX / offsetWidth) * 100;
        const y = (clientY / offsetHeight) * 100;
        containerRef.current.style.setProperty('--mouse-x', `${x}%`);
        containerRef.current.style.setProperty('--mouse-y', `${y}%`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const Blob: React.FC<{ className: string; style?: React.CSSProperties }> = ({ className, style }) => {
    return <div className={`absolute rounded-full animate-aurora ${className}`} style={style}></div>
  }

  return (
    <div ref={containerRef} className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <div className="relative w-full h-full">
        <Blob className="top-[-10%] left-[-25%] w-[80%] h-[80%] bg-purple-400/20 dark:bg-teal-600/20" style={{ transform: 'translate(calc(var(--mouse-x) * -0.1), calc(var(--mouse-y) * -0.1))' }} />
        <Blob className="bottom-[-10%] right-[-25%] w-[80%] h-[80%] bg-blue-400/20 dark:bg-cyan-600/20 [animation-delay:3s]" style={{ transform: 'translate(calc(var(--mouse-x) * 0.1), calc(var(--mouse-y) * 0.1))' }} />
        <Blob className="bottom-[20%] left-[10%] w-[50%] h-[50%] bg-pink-400/10 dark:bg-emerald-600/10 [animation-delay:6s]" style={{ transform: 'translate(calc(var(--mouse-x) * 0.05), calc(var(--mouse-y) * -0.05))' }} />
        <Blob className="top-[10%] right-[10%] w-[40%] h-[40%] bg-teal-400/10 dark:bg-sky-600/10 [animation-delay:9s]" style={{ transform: 'translate(calc(var(--mouse-x) * -0.05), calc(var(--mouse-y) * 0.05))' }} />
      </div>
    </div>
  );
};

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-12 md:pt-40 md:pb-16">
      <div key={location.pathname} className="animated-element animate-fade-in-up">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/credentials" element={<CredentialsPage />} />
          <Route path="/certifications-awards" element={<CertificationsAwardsPage />} />
          <Route path="/tutoring" element={<TutoringPage />} />
          <Route path="/tutoring/:gradeId" element={<TutoringPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </div>
    </main>
  );
}


const App: React.FC = () => {
  return (
    <ThemeProvider>
      {/* <HashRouter> */}
      <BrowserRouter>
        <div className="bg-gray-50 dark:bg-dark-background text-gray-800 dark:text-gray-200 min-h-screen flex flex-col font-sans transition-colors duration-300 overflow-x-hidden">
          <InteractiveAuroraBackground />
          <Navbar />
          <AnimatedRoutes />
          <Footer />
        </div>
      </BrowserRouter>
      {/* </HashRouter> */}
    </ThemeProvider>
  );
};

export default App;