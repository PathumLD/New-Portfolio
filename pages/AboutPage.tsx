import React from 'react';
import { FiBriefcase, FiCheckCircle, FiGlobe, FiHeart, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi';
import { profileData } from '../data/profile';
import { Pill, PrimaryButton, SecondaryButton, SectionIntro, Surface } from '../components/PublicUI';
import sideProfile from '../assets/Side.webp';

const detailCards = [
  { label: 'Email', value: profileData.email, icon: FiMail, href: `mailto:${profileData.email}` },
  { label: 'Phone', value: profileData.phone || 'Available on request', icon: FiPhone, href: profileData.phone ? `tel:${profileData.phone}` : undefined },
  { label: 'Location', value: profileData.location, icon: FiMapPin },
  { label: 'Experience', value: `${profileData.yearsOfExperience}+ Years`, icon: FiBriefcase },
  { label: 'Status', value: profileData.availability, icon: FiCheckCircle },
  { label: 'Languages', value: profileData.languages.join(', '), icon: FiGlobe },
];

const AboutPage: React.FC = () => {
  const bioSections = profileData.longBio.trim().split('\n\n').filter(Boolean);

  return (
    <div className="space-y-20">
      <SectionIntro
        eyebrow="About"
        title="A practical builder with a strong visual instinct."
        description="I work across software engineering, design, and education, bringing structure to ideas without losing the human side of the experience."
        align="center"
      />

      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative">
          <div className="absolute -left-4 top-8 h-28 w-28 border border-emerald-500/25 bg-emerald-500/10" />
          <Surface className="relative overflow-hidden p-3">
            <img src={sideProfile} alt={profileData.name} className="aspect-[4/5] w-full object-cover grayscale transition duration-500 hover:grayscale-0" />
          </Surface>
        </div>

        <div className="space-y-5">
          <Surface className="p-6">
            <Pill tone="emerald">{profileData.title}</Pill>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">{profileData.name}</h2>
            <p className="mt-4 text-base leading-8 text-zinc-600 dark:text-zinc-300">{profileData.shortBio}</p>
            <div className="mt-6 border-l-2 border-emerald-500 pl-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Education</p>
              <p className="mt-2 text-lg font-semibold text-zinc-950 dark:text-white">{profileData.education}</p>
            </div>
          </Surface>

          <div className="grid gap-4 sm:grid-cols-2">
            {detailCards.map((detail) => (
              <Surface key={detail.label} className="p-5">
                <div className="flex items-start gap-3">
                  <detail.icon className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">{detail.label}</p>
                    {detail.href ? (
                      <a href={detail.href} className="mt-1 block break-words text-sm font-semibold text-zinc-950 transition hover:text-emerald-600 dark:text-white dark:hover:text-emerald-300">
                        {detail.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-semibold text-zinc-950 dark:text-white">{detail.value}</p>
                    )}
                  </div>
                </div>
              </Surface>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionIntro eyebrow="Story" title="The work is a mix of logic, taste, and teaching." />
        <div className="grid gap-4">
          {bioSections.map((section, index) => (
            <Surface key={index} className="p-6">
              <div className="flex gap-5">
                <span className="mt-2 h-2 w-2 shrink-0 bg-emerald-500" />
                <p className="text-base leading-8 text-zinc-600 dark:text-zinc-300">{section.trim()}</p>
              </div>
            </Surface>
          ))}
        </div>
      </section>

      <section>
        <SectionIntro eyebrow="Core skills" title="A broad toolkit, grouped by practical use." />
        <div className="flex flex-wrap gap-2">
          {profileData.skills.map((skill, index) => (
            <div key={`${skill.name}-${index}`} className="inline-flex items-center gap-2 border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-medium text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
              <skill.icon className="h-4 w-4 text-emerald-500" />
              {skill.name}
            </div>
          ))}
        </div>
      </section>

      <Surface className="p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <FiHeart className="h-6 w-6 text-emerald-500" />
              <Pill tone="cyan">Collaboration</Pill>
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">Let&apos;s work on something useful.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              I&apos;m open to software roles, design-heavy builds, and teaching opportunities.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/contact">Contact me</PrimaryButton>
            <SecondaryButton href="/projects">View work</SecondaryButton>
          </div>
        </div>
      </Surface>
    </div>
  );
};

export default AboutPage;
