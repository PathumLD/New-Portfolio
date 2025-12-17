import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'My Journey', path: '/credentials' },
  { name: 'Projects', path: '/projects' },
  { name: 'Certificates/Awards', path: '/certifications-awards' },
  { name: 'Tutoring', path: '/tutoring' },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const linkClasses = "relative px-3 py-2 rounded-full text-sm font-medium transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary-500";
  const activeLinkClasses = "text-primary-600 dark:text-primary-400";
  const inactiveLinkClasses = "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white";

  const ActiveLinkIndicator = () => (
    <span className="absolute inset-0 bg-primary-500/10 dark:bg-primary-400/10 rounded-full -z-10"></span>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <nav className={`relative container mx-auto rounded-full border transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl shadow-xl border-black/10 dark:border-white/10' : 'bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-lg border-black/5 dark:border-white/5'}`}>
        <div className="flex items-center justify-between h-14 px-6">
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-xl font-bold bg-clip-text text-transparent bg-primary-600 dark:from-primary-400 dark:to-sky-400">
              MyPortfolio
            </NavLink>
          </div>
          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-baseline space-x-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && <ActiveLinkIndicator />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FiMoon className="h-5 w-5" /> : <FiSun className="h-5 w-5" />}
            </button>
            <div className="ml-2 md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none transition-colors"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? <FiMenu className="block h-6 w-6" /> : <FiX className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden mt-2" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl shadow-lg border border-black/5 dark:border-white/5">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `relative block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;