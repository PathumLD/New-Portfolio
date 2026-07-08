import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import TabbedContent from '../components/TabbedContent';
import { Pill, SectionIntro, SmartLink, Surface } from '../components/PublicUI';
import { projects } from '../data/projects';
import { Project, ProjectCategory } from '../types';

const ProjectCard: React.FC<{ project: Project; featured?: boolean }> = ({ project, featured = false }) => (
  <Surface className={`group overflow-hidden ${featured ? 'lg:grid lg:grid-cols-[1.15fr_0.85fr]' : 'flex h-full flex-col'}`}>
    <div className={`overflow-hidden bg-zinc-900 ${featured ? 'min-h-[22rem]' : 'aspect-[16/10]'}`}>
      <img src={project.image} alt={project.title} className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
    </div>
    <div className="flex flex-1 flex-col p-5 md:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="cyan">{project.category}</Pill>
        {project.tags.slice(0, featured ? 10 : 6).map((tag) => (
          <Pill key={tag}>{tag}</Pill>
        ))}
      </div>
      <h2 className={`${featured ? 'text-3xl md:text-4xl' : 'text-2xl'} mt-5 font-semibold tracking-tight text-zinc-950 dark:text-white`}>
        {project.title}
      </h2>
      <p className="mt-4 flex-1 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{project.description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {project.liveUrl && (
          <SmartLink href={project.liveUrl} external className="inline-flex items-center gap-2 bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400">
            Visit
            <FiExternalLink className="h-4 w-4" />
          </SmartLink>
        )}
      </div>
    </div>
  </Surface>
);

const ProjectList: React.FC<{ category?: ProjectCategory; items: Project[] }> = ({ category, items }) => {
  const filteredProjects = category ? items.filter((project) => project.category === category) : items;

  if (filteredProjects.length === 0) {
    return <Surface className="p-8 text-center text-zinc-600 dark:text-zinc-300">No projects in this category yet.</Surface>;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {filteredProjects.map((project, index) => (
        <div key={project.id} className="animated-element animate-fade-in-up" style={{ '--stagger': index + 1 } as React.CSSProperties}>
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
};

const ProjectsPage: React.FC = () => {
  const [featuredProject, ...remainingProjects] = projects;
  const archiveProjects = featuredProject ? remainingProjects : projects;
  const categories = Array.from(new Set(archiveProjects.map((project) => project.category)));
  const tabs = [
    { label: 'All', content: <ProjectList items={archiveProjects} /> },
    ...categories.map((category) => ({
      label: category,
      content: <ProjectList category={category} items={archiveProjects} />,
    })),
  ];

  return (
    <div className="space-y-16">
      <SectionIntro
        eyebrow="Projects"
        title="Selected work across apps, interfaces, and visual systems."
        description="A curated archive of practical builds, experiments, and design-led products."
        align="center"
      />

      {featuredProject && (
        <section>
          <ProjectCard project={featuredProject} featured />
        </section>
      )}

      {archiveProjects.length > 0 && (
        <section>
          <SectionIntro eyebrow="Archive" title="Browse by discipline." />
          <TabbedContent tabs={tabs} />
        </section>
      )}
    </div>
  );
};

export default ProjectsPage;
