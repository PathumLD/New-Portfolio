import React, { useEffect, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import TabbedContent from '../components/TabbedContent';
import { Pill, SectionIntro, SmartLink, Surface } from '../components/PublicUI';
import { projects as fallbackProjects } from '../data/projects';
import { Project } from '../types';
import { projectCategoriesService, projectsService } from '../src/services';
import type { Project as DatabaseProject, ProjectCategoryRecord } from '../src/types/database.types';

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

const ProjectList: React.FC<{ category?: string; items: Project[] }> = ({ category, items }) => {
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

function mapDatabaseProject(project: DatabaseProject): Project {
  return {
    id: project.id,
    title: project.title,
    category: project.category,
    image: project.images[0] || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    description: project.description,
    tags: project.tags,
    liveUrl: project.demo_link || project.github_link || undefined,
  };
}

const fallbackCategories = ['Website', 'Web Applications', 'Mobile Applications'];

const ProjectsPage: React.FC = () => {
  const [projectItems, setProjectItems] = useState<Project[]>(fallbackProjects);
  const [categoryNames, setCategoryNames] = useState<string[]>(fallbackCategories);

  useEffect(() => {
    let isMounted = true;

    const loadProjectsPageData = async () => {
      try {
        const [projectData, categoryData] = await Promise.all([
          projectsService.getAll(),
          projectCategoriesService.getAll(),
        ]);

        if (!isMounted) return;

        if (projectData.length > 0) {
          setProjectItems(projectData.map(mapDatabaseProject));
        }

        if (categoryData.length > 0) {
          setCategoryNames(categoryData.map((category: ProjectCategoryRecord) => category.name));
        }
      } catch (error) {
        console.error('Unable to load projects page data from Supabase:', error);
      }
    };

    loadProjectsPageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const [featuredProject, ...remainingProjects] = projectItems;
  const archiveProjects = featuredProject ? remainingProjects : projectItems;
  const projectDerivedCategories = archiveProjects.map((project) => project.category);
  const categories = Array.from(new Set([...categoryNames, ...projectDerivedCategories]));
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
