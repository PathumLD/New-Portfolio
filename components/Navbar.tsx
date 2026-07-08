import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiExternalLink, FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import logo1 from '../assets/Logo1.png';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Journey', path: '/credentials' },
  { name: 'Projects', path: '/projects' },
  { name: 'Achievements', path: '/certifications-awards' },
  { name: 'Tutoring', path: 'https://class.pathumld.com/', external: true },
  //{ name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkBase = 'relative px-2.5 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400';
  const inactive = 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white';
  const active = 'text-zinc-950 dark:text-white';

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav
        className={`mx-auto max-w-7xl border transition-all duration-300 ${
          isScrolled
            ? 'border-zinc-200/80 bg-white/86 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/82 dark:shadow-[0_18px_60px_rgba(0,0,0,0.32)]'
            : 'border-zinc-200/50 bg-white/58 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/52'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 sm:px-5">
          <NavLink to="/" className="group flex min-w-0 items-center gap-3" onClick={() => setIsOpen(false)}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-zinc-200 bg-white transition-all duration-300 group-hover:-rotate-3 group-hover:border-emerald-500 dark:border-white/10">
              <img src={logo1} alt="Pathum Dissanayake logo" className="h-full w-full object-cover object-center" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold leading-tight tracking-tight text-zinc-950 dark:text-white">
                Pathum Dissanayake
              </span>
              <span className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">Software Engineer / Designer / Educator</span>
            </span>
          </NavLink>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) =>
              link.external ? (
                <a key={link.name} href={link.path} target="_blank" rel="noopener noreferrer" className={`${linkBase} ${inactive} inline-flex items-center gap-1`}>
                  {link.name}
                  <FiExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <NavLink key={link.name} to={link.path} className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && (
                        <motion.span
                          layoutId="active-nav-indicator"
                          className="absolute inset-x-2 -bottom-[1px] h-0.5 bg-emerald-500"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ),
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center border border-zinc-200 bg-white/70 text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-white/30 dark:hover:text-white"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FiMoon className="h-5 w-5" /> : <FiSun className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className="grid h-10 w-10 place-items-center border border-zinc-200 bg-white/70 text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-white/30 dark:hover:text-white lg:hidden"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-zinc-200/70 dark:border-white/10 lg:hidden"
            >
              <div className="grid gap-1 px-3 py-3">
                {navLinks.map((link, index) =>
                  link.external ? (
                    <motion.a
                      key={link.name}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.025 }}
                      className="flex items-center justify-between px-3 py-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-950 hover:text-white dark:text-zinc-300 dark:hover:bg-white dark:hover:text-zinc-950"
                    >
                      {link.name}
                      <FiExternalLink className="h-4 w-4" />
                    </motion.a>
                  ) : (
                    <motion.div key={link.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.025 }}>
                      <NavLink
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `block px-3 py-3 text-sm font-medium transition ${
                            isActive
                              ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                              : 'text-zinc-600 hover:bg-zinc-950 hover:text-white dark:text-zinc-300 dark:hover:bg-white dark:hover:text-zinc-950'
                          }`
                        }
                      >
                        {link.name}
                      </NavLink>
                    </motion.div>
                  ),
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
