import React from 'react';
import { FiArrowRight, FiAward, FiBookOpen, FiBriefcase, FiCode, FiExternalLink, FiLayers, FiPenTool } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { profileData } from '../data/profile';
import { projects } from '../data/projects';
import { blogs } from '../data/blogs';
import { tutoringData } from '../data/tutoring';
import { experience } from '../data/experience';
import { certifications } from '../data/certifications';
import { Pill, PrimaryButton, SecondaryButton, SectionIntro, SmartLink, Surface } from '../components/PublicUI';

const capabilityCards = [
  {
    title: 'Software Engineering',
    description: 'Modern React, TypeScript, APIs, dashboards, and product interfaces built with maintainable structure.',
    icon: FiCode,
    tone: 'emerald' as const,
  },
  {
    title: 'Visual Design',
    description: 'Brand-aware UI, graphic systems, layout craft, and assets that make technical work feel polished.',
    icon: FiPenTool,
    tone: 'cyan' as const,
  },
  {
    title: 'Teaching',
    description: 'Clear explanations, lesson planning, and mentoring for learners moving from idea to implementation.',
    icon: FiBookOpen,
    tone: 'amber' as const,
  },
];

const HomePage: React.FC = () => {
  const featuredProjects = projects.slice(0, 3);
  const latestBlogs = blogs.slice(0, 2);
  const skillHighlights = profileData.skills.slice(0, 14);

  return (
    <div className="space-y-24">
      <section className="grid min-h-[calc(100vh-9rem)] items-center gap-12 py-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="animated-element animate-fade-in-up inline-flex items-center gap-3 border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <span className="h-2 w-2 bg-emerald-500" />
            {profileData.availability}
          </div>

          <h1
            className="text-sheen animated-element mt-6 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-tight text-zinc-950 dark:text-white sm:text-6xl lg:text-7xl"
            style={{ '--stagger': 1 } as React.CSSProperties}
          >
            Engineering software. Designing visuals. Teaching what I know.
          </h1>

          <p
            className="animated-element animate-fade-in-up mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300"
            style={{ '--stagger': 2 } as React.CSSProperties}
          >
            I&apos;m {profileData.name} — a full-stack software engineer, visual designer, and educator who turns practical ideas into polished digital experiences, and helps others learn to build them too.
          </p>

          <div
            className="animated-element animate-fade-in-up mt-8 flex flex-col gap-3 sm:flex-row"
            style={{ '--stagger': 3 } as React.CSSProperties}
          >
            <PrimaryButton href="/projects">
              View selected work
              <FiArrowRight className="h-4 w-4" />
            </PrimaryButton>
            <SecondaryButton href="/contact">Start a conversation</SecondaryButton>
          </div>

          <div
            className="animated-element animate-fade-in-up mt-10 grid max-w-2xl grid-cols-3 border-y border-zinc-200 dark:border-white/10"
            style={{ '--stagger': 4 } as React.CSSProperties}
          >
            {[
              [`${profileData.yearsOfExperience}+`, 'Years'],
              [`${projects.length}+`, 'Projects'],
              [`${profileData.skills.length}+`, 'Skills'],
            ].map(([value, label]) => (
              <div key={label} className="py-5 pr-4">
                <p className="text-3xl font-semibold text-zinc-950 dark:text-white">{value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animated-element animate-fade-in-up relative" style={{ '--stagger': 2 } as React.CSSProperties}>
          <div className="motion-frame absolute -right-5 top-10 h-40 w-40 border border-cyan-400/30 bg-cyan-400/10" />
          <div className="motion-frame absolute -bottom-6 -left-5 h-32 w-32 border border-amber-400/30 bg-amber-400/10 [animation-delay:1.4s]" />
          <Surface className="motion-frame relative overflow-hidden p-3">
            <div className="grid gap-3 md:grid-cols-[0.82fr_1fr]">
              <div className="min-h-80 bg-zinc-900">
                <img src={profileData.profilePicture} alt={profileData.name} className="h-full w-full object-cover grayscale transition duration-500 hover:grayscale-0" />
              </div>
              <div className="flex flex-col justify-between border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/5">
                <div>
                  <Pill tone="emerald">{profileData.title}</Pill>
                  <h2 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">{profileData.name}</h2>
                  <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{profileData.shortBio}</p>
                </div>
                <div className="mt-8 grid gap-3">
                  {profileData.socials.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="magnetic-link flex items-center justify-between border border-zinc-200 bg-white px-3 py-3 text-sm font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-zinc-950 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-300 dark:hover:border-emerald-400 dark:hover:text-white"
                    >
                      <span className="flex items-center gap-3">
                        <social.icon className="h-4 w-4" />
                        {social.name}
                      </span>
                      <FiExternalLink className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Surface>
        </div>
      </section>

      <section>
        <SectionIntro eyebrow="Capabilities" title="A portfolio across code, design, and education." description="A multidisciplinary mix shaped around useful products, clear visuals, and practical learning." />
        <div className="grid gap-4 md:grid-cols-3">
          {capabilityCards.map((item, index) => (
            <Surface key={item.title} className="group animated-element animate-fade-in-up p-6" style={{ '--stagger': index + 1 } as React.CSSProperties}>
              <item.icon className="h-8 w-8 text-emerald-500 transition duration-300 group-hover:rotate-3 group-hover:scale-110" />
              <Pill tone={item.tone}>{item.title}</Pill>
              <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{item.description}</p>
            </Surface>
          ))}
        </div>
      </section>

      <section>
        <SectionIntro eyebrow="Selected work" title="Recent projects with practical, product-minded execution." description="A focused view of web apps, interfaces, and creative systems." action={{ label: 'View all projects', href: '/projects' }} />
        <div className="grid gap-5 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <Surface key={project.id} className="group animated-element animate-fade-in-up overflow-hidden" style={{ '--stagger': index + 1 } as React.CSSProperties}>
              <div className="aspect-[16/10] overflow-hidden bg-zinc-900">
                <img src={project.image} alt={project.title} className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
              </div>
              <div className="p-5">
                <Pill tone="cyan">{project.category}</Pill>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">{project.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.slice(0, 4).map((tag) => (
                    <Pill key={tag}>{tag}</Pill>
                  ))}
                </div>
              </div>
            </Surface>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Surface className="p-6">
          <FiBriefcase className="h-8 w-8 text-emerald-500" />
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">Journey snapshot</h2>
          <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">Experience, design practice, and teaching work are presented as one continuous professional story.</p>
          <Link to="/credentials" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Open journey
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </Surface>
        <div className="grid gap-4">
          {experience.slice(0, 2).map((item) => (
            <Surface key={item.id} className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">{item.role}</h3>
                  <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">{item.company}</p>
                </div>
                <Pill tone="amber">{item.period}</Pill>
              </div>
              <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{item.description}</p>
            </Surface>
          ))}
        </div>
      </section>

      <section>
        <SectionIntro eyebrow="Stack" title="Tools I use to turn ideas into shipped interfaces." />
        <div className="marquee-mask overflow-hidden border-y border-zinc-200 py-4 dark:border-white/10">
          <div className="flex w-max animate-marquee gap-2 hover:[animation-play-state:paused]">
            {[...skillHighlights, ...skillHighlights].map((skill, index) => (
              <div
                key={`${skill.name}-${index}`}
                className="inline-flex items-center gap-2 border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:-translate-y-1 hover:border-emerald-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
              >
                <skill.icon className="h-4 w-4 text-emerald-500" />
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Surface className="p-6">
          <div className="flex items-center gap-3">
            <FiLayers className="h-7 w-7 text-cyan-500" />
            <Pill tone="cyan">Tutoring</Pill>
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">Structured learning programs</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{tutoringData[0]?.description}</p>
          <a href="https://class.pathumld.com/" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Visit class site
            <FiExternalLink className="h-4 w-4" />
          </a>
        </Surface>

        <Surface className="p-6">
          <div className="flex items-center gap-3">
            <FiAward className="h-7 w-7 text-amber-500" />
            <Pill tone="amber">Achievements</Pill>
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">{certifications[0]?.title}</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            {certifications.length} verified certifications are grouped into a cleaner achievements archive.
          </p>
          <Link to="/certifications-awards" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            View achievements
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </Surface>
      </section>

      {latestBlogs.length > 0 && (
        <section>
          <SectionIntro eyebrow="Writing" title="Notes on development, design, and building better interfaces." action={{ label: 'Read the blog', href: '/blog' }} />
          <div className="grid gap-4 md:grid-cols-2">
            {latestBlogs.map((blog) => (
              <Surface key={blog.id} className="group overflow-hidden">
                <div className="grid gap-0 sm:grid-cols-[0.45fr_0.55fr]">
                  <img src={blog.thumbnail} alt={blog.title} className="h-full min-h-56 w-full object-cover grayscale transition duration-500 group-hover:grayscale-0" />
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-zinc-950 dark:text-white">{blog.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{blog.description}</p>
                    <SmartLink href={blog.url} external className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      Read article
                      <FiExternalLink className="h-4 w-4" />
                    </SmartLink>
                  </div>
                </div>
              </Surface>
            ))}
          </div>
        </section>
      )}

      <Surface className="overflow-hidden">
        <div className="grid gap-8 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">Contact</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white md:text-4xl">Have a project, role, or collaboration in mind?</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">Send a message and I&apos;ll get back to you with the next practical step.</p>
          </div>
          <PrimaryButton href="/contact">
            Contact me
            <FiArrowRight className="h-4 w-4" />
          </PrimaryButton>
        </div>
      </Surface>
    </div>
  );
};

export default HomePage;
