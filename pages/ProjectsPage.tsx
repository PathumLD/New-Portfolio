import React from 'react';
import { projects } from '../data/projects';
import { Project, ProjectCategory } from '../types';
import TabbedContent from '../components/TabbedContent';
import { FiGithub, FiExternalLink, FiCode } from 'react-icons/fi';

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div className="group relative bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/20 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-white/10 hover:border-primary-400/50 dark:hover:border-primary-500/50 transform hover:scale-[1.02] hover:-translate-y-2 flex flex-col h-full">
    {/* Animated gradient border effect */}
    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400 opacity-20 blur-xl"></div>
    </div>

    {/* Image Section with Overlay */}
    <div className="relative overflow-hidden h-56">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-110 transition-all duration-700 ease-out"
      />
      {/* Gradient overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

      {/* Floating category badge */}
      <div className="absolute top-4 left-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white backdrop-blur-md shadow-lg border border-white/50 dark:border-gray-700/50">
          <FiCode className="w-3 h-3" />
          {project.category}
        </span>
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
    </div>

    {/* Content Section */}
    <div className="p-6 flex flex-col flex-grow relative z-10">
      <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
        {project.title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-5 text-sm leading-relaxed flex-grow">
        {project.description}
      </p>

      {/* Tags Section */}
      <div className="mt-auto">
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map((tag, index) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-primary-100/80 to-primary-50/80 dark:from-primary-900/60 dark:to-primary-800/60 text-primary-800 dark:text-primary-200 border border-primary-200/50 dark:border-primary-700/50 backdrop-blur-sm hover:scale-105 transition-transform duration-200 shadow-sm"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 transition-all duration-300 hover:scale-105 hover:shadow-lg group/btn"
            >
              <FiGithub className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
              Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-primary-500/50 group/btn flex-1 justify-center"
            >
              <FiExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
);

const ProjectList: React.FC<{ category: ProjectCategory }> = ({ category }) => {
  const filteredProjects = projects.filter(p => p.category === category);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProjects.map((project, index) => <div key={project.id} className="animated-element animate-fade-in-up" style={{ '--stagger': index + 1 } as React.CSSProperties}><ProjectCard project={project} /></div>)}
    </div>
  );
};

const ProjectsPage: React.FC = () => {
  const tabs = Object.values(ProjectCategory).map(category => ({
    label: category,
    content: <ProjectList category={category} />,
  }));

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">My Projects</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">A selection of my work across different disciplines.</p>
      </div>
      <TabbedContent tabs={tabs} />
    </div>
  );
};

export default ProjectsPage;