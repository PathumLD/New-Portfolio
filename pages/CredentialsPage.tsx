import React, { useEffect, useState } from 'react';
import { FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi';
import TabbedContent from '../components/TabbedContent';
import { Pill, SectionIntro, Surface } from '../components/PublicUI';
import { education } from '../data/education';
import { experience as fallbackExperience } from '../data/experience';
import { volunteering } from '../data/volunteering';
import { Education, Experience, Volunteering } from '../types';
import { educationService, experiencesService, volunteersService } from '../src/services';
import type {
  Education as DatabaseEducation,
  Experience as DatabaseExperience,
  Volunteer as DatabaseVolunteer,
} from '../src/types/database.types';

type TimelineItem = Education | Experience | Volunteering;

const getTitle = (item: TimelineItem) => {
  if ('degree' in item) return item.degree;
  return item.role;
};

const getOrganization = (item: TimelineItem) => {
  if ('institution' in item) return item.institution;
  if ('company' in item) return item.company;
  return item.organization;
};

const TimelineCard: React.FC<{ item: TimelineItem; index: number }> = ({ item, index }) => (
  <div className="relative grid gap-4 pl-9 md:grid-cols-[10rem_1fr] md:pl-0">
    <div className="absolute left-2 top-2 h-full w-px bg-zinc-200 dark:bg-white/10 md:hidden" />
    <span className="absolute left-0 top-1 grid h-5 w-5 place-items-center border border-emerald-500 bg-white dark:bg-[#151518] md:left-[10.45rem]">
      <span className="h-2 w-2 bg-emerald-500" />
    </span>
    <div className="hidden border-r border-zinc-200 pr-7 text-right dark:border-white/10 md:block">
      <p className="text-sm font-semibold text-zinc-950 dark:text-white">{item.period}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Step {index + 1}</p>
    </div>
    <Surface className="p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">{getTitle(item)}</h3>
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <FiMapPin className="h-4 w-4" />
            {getOrganization(item)}
          </p>
        </div>
        <Pill tone="amber">
          <FiCalendar className="mr-1 h-3.5 w-3.5" />
          {item.period}
        </Pill>
      </div>
      <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{item.description}</p>
      {'skills' in item && item.skills && (
        <div className="mt-5 flex flex-wrap gap-2">
          {item.skills.map((skill) => (
            <Pill key={skill}>{skill}</Pill>
          ))}
        </div>
      )}
    </Surface>
  </div>
);

const Timeline: React.FC<{ items: TimelineItem[] }> = ({ items }) => (
  <div className="space-y-6">
    {items.map((item, index) => (
      <TimelineCard key={item.id} item={item} index={index} />
    ))}
  </div>
);

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
});

function formatDatabaseDate(date: string) {
  return monthFormatter.format(new Date(`${date}T00:00:00`));
}

function mapDatabaseExperience(item: DatabaseExperience, index: number): Experience {
  return {
    id: item.id || index + 1,
    company: item.company,
    role: item.job_title,
    period: `${formatDatabaseDate(item.start_date)} - ${item.end_date ? formatDatabaseDate(item.end_date) : 'Present'}`,
    description: item.description,
    skills: item.tags,
  };
}

function mapDatabaseEducation(item: DatabaseEducation, index: number): Education {
  return {
    id: item.id || index + 1,
    institution: item.university,
    degree: item.degree,
    period: `${formatDatabaseDate(item.start_date)} - ${item.end_date ? formatDatabaseDate(item.end_date) : 'Present'}`,
    description: item.description,
    skills: item.skills,
  };
}

function mapDatabaseVolunteer(item: DatabaseVolunteer, index: number): Volunteering {
  return {
    id: item.id || index + 1,
    organization: item.community,
    role: item.role,
    period: `${formatDatabaseDate(item.start_date)} - ${item.end_date ? formatDatabaseDate(item.end_date) : 'Present'}`,
    description: item.description,
  };
}

const CredentialsPage: React.FC = () => {
  const [experienceItems, setExperienceItems] = useState<Experience[]>(fallbackExperience);
  const [educationItems, setEducationItems] = useState<Education[]>(education);
  const [volunteeringItems, setVolunteeringItems] = useState<Volunteering[]>(volunteering);

  useEffect(() => {
    let isMounted = true;

    const loadTimeline = async () => {
      try {
        const [experienceData, educationData, volunteerData] = await Promise.all([
          experiencesService.getAll(),
          educationService.getAll(),
          volunteersService.getAll(),
        ]);

        if (!isMounted) return;

        if (experienceData.length > 0) setExperienceItems(experienceData.map(mapDatabaseExperience));
        if (educationData.length > 0) setEducationItems(educationData.map(mapDatabaseEducation));
        if (volunteerData.length > 0) setVolunteeringItems(volunteerData.map(mapDatabaseVolunteer));
      } catch (error) {
        console.error('Unable to load timeline data from Supabase:', error);
      }
    };

    loadTimeline();

    return () => {
      isMounted = false;
    };
  }, []);

  const tabs = [
    { label: 'Experience', content: <Timeline items={experienceItems} /> },
    { label: 'Education', content: <Timeline items={educationItems} /> },
    { label: 'Volunteering', content: <Timeline items={volunteeringItems} /> },
  ];

  return (
    <div className="space-y-14">
      <SectionIntro
        eyebrow="Journey"
        title="A timeline of engineering, design, teaching, and service."
        description="A cleaner view of the professional and academic path behind the work."
        align="center"
      />

      <Surface className="grid gap-5 p-5 md:grid-cols-3">
        {[
          ['Experience', `${experienceItems.length} roles`],
          ['Education', `${educationItems.length} records`],
          ['Volunteering', `${volunteeringItems.length} activities`],
        ].map(([label, value]) => (
          <div key={label} className="border-l-2 border-emerald-500 pl-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">{value}</p>
          </div>
        ))}
      </Surface>

      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center gap-3">
          <FiBriefcase className="h-6 w-6 text-emerald-500" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Timeline</p>
        </div>
        <TabbedContent tabs={tabs} />
      </div>
    </div>
  );
};

export default CredentialsPage;
