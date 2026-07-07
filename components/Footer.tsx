import React from 'react';
import { FiArrowUpRight, FiMail, FiMapPin } from 'react-icons/fi';
import { profileData } from '../data/profile';

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-zinc-200/80 bg-white/45 dark:border-white/10 dark:bg-zinc-950/35">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr] lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">Portfolio</p>
          <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Designing and building useful digital products with engineering clarity.
          </h2>
          <p className="mt-5 text-sm text-zinc-500 dark:text-zinc-400">
            &copy; {new Date().getFullYear()} {profileData.name}. All rights reserved.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-1">
          <a
            href={`mailto:${profileData.email}`}
            className="magnetic-link group flex items-center justify-between border border-zinc-200 bg-white/70 p-4 text-sm font-medium text-zinc-700 transition hover:-translate-y-1 hover:border-emerald-500 hover:text-zinc-950 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-emerald-400 dark:hover:text-white"
          >
            <span className="flex items-center gap-3">
              <FiMail className="h-5 w-5 text-emerald-500" />
              {profileData.email}
            </span>
            <FiArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>

          <div className="flex items-center gap-3 border border-zinc-200 bg-white/70 p-4 text-sm font-medium text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
            <FiMapPin className="h-5 w-5 text-cyan-500" />
            {profileData.location}
          </div>

          <div className="flex items-center gap-3">
            {profileData.socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-11 w-11 place-items-center border border-zinc-200 bg-white/70 text-zinc-600 transition hover:-translate-y-1 hover:rotate-3 hover:border-zinc-950 hover:bg-zinc-950 hover:text-white dark:border-white/10 dark:bg-white/5 dark:text-zinc-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-zinc-950"
                aria-label={social.name}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
