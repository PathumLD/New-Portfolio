import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';
import { motion, useReducedMotion } from 'framer-motion';

type SectionIntroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: {
    label: string;
    href: string;
    external?: boolean;
  };
};

export const SectionIntro: React.FC<SectionIntroProps> = ({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
}) => {
  const centered = align === 'center';
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-10 ${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
          {eyebrow}
        </p>
      )}
      <div className={`${action && !centered ? 'items-end justify-between gap-6 md:flex' : ''}`}>
        <div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-zinc-950 dark:text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className={`mt-4 text-base leading-8 text-zinc-600 dark:text-zinc-300 sm:text-lg ${centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className={`${centered ? 'mt-6' : 'mt-6 md:mt-0'} shrink-0`}>
            <SmartLink
              href={action.href}
              external={action.external}
              className="inline-flex items-center gap-2 border-b border-emerald-500 pb-1 text-sm font-semibold text-zinc-950 transition-colors hover:text-emerald-600 dark:text-white dark:hover:text-emerald-300"
            >
              {action.label}
              {action.external ? <FiExternalLink className="h-4 w-4" /> : <FiArrowRight className="h-4 w-4" />}
            </SmartLink>
          </div>
        )}
      </div>
    </motion.div>
  );
};

type SmartLinkProps = React.PropsWithChildren<{
  href: string;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
}>;

export const SmartLink: React.FC<SmartLinkProps> = ({ href, external, className, children, ariaLabel }) => {
  const isExternal = external || href.startsWith('http');

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
};

type SurfaceProps = React.ComponentProps<typeof motion.div>;

export const Surface: React.FC<SurfaceProps> = ({ className = '', children, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 24, scale: 0.985 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: '-72px' }}
    transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -4 }}
    {...props}
    className={`premium-surface border border-zinc-200/80 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition-shadow duration-500 hover:shadow-[0_30px_100px_rgba(15,23,42,0.14)] dark:border-white/[0.14] dark:bg-[#151518]/95 dark:shadow-[0_24px_80px_rgba(0,0,0,0.36)] dark:hover:shadow-[0_30px_100px_rgba(0,0,0,0.5)] ${className}`}
  >
    {children}
  </motion.div>
);

export const Pill: React.FC<React.PropsWithChildren<{ tone?: 'emerald' | 'cyan' | 'amber' | 'neutral' }>> = ({
  tone = 'neutral',
  children,
}) => {
  const tones = {
    emerald: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    cyan: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    amber: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    neutral: 'border-zinc-300/70 bg-zinc-100/80 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300',
  };

  return (
    <span className={`inline-flex items-center border px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
};

export const PrimaryButton: React.FC<SmartLinkProps> = ({ children, className = '', ...props }) => (
  <SmartLink
    {...props}
    className={`magnetic-link inline-flex items-center justify-center gap-2 bg-emerald-500 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-[0_18px_48px_rgba(16,185,129,0.24)] transition hover:-translate-y-0.5 hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950 ${className}`}
  >
    {children}
  </SmartLink>
);

export const SecondaryButton: React.FC<SmartLinkProps> = ({ children, className = '', ...props }) => (
  <SmartLink
    {...props}
    className={`magnetic-link inline-flex items-center justify-center gap-2 border border-zinc-300 bg-white/70 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:border-zinc-500 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:border-white/35 ${className}`}
  >
    {children}
  </SmartLink>
);
