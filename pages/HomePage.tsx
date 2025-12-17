import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { profileData } from '../data/profile';
import { projects } from '../data/projects';
import { blogs } from '../data/blogs';
import { tutoringData } from '../data/tutoring';
import { experience } from '../data/experience';
import { certifications } from '../data/certifications';
import { FiArrowRight, FiCode, FiPenTool, FiBookOpen, FiExternalLink } from 'react-icons/fi';
import { Project, Blog, Experience, Certification } from '../types';

// Section Header Component
const SectionHeader: React.FC<{ title: string; subtitle?: string; link: string }> = ({ title, subtitle, link }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
      {title}
    </h2>
    {subtitle && <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{subtitle}</p>}
    <Link
      to={link}
      className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors group"
    >
      View All
      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
    </Link>
  </div>
);

// Project Card Component
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 transform hover:-translate-y-1 flex flex-col h-full">
    <div className="relative overflow-hidden">
      <img src={project.image} alt={project.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{project.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm flex-grow">{project.description}</p>
      <div className="mt-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-primary-100/50 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="flex justify-end space-x-4">
          {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors">Code</a>}
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-full shadow-md transition-all hover:scale-105">Live Demo</a>}
        </div>
      </div>
    </div>
  </div>
);

// Blog Card Component
const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => (
  <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 transform hover:-translate-y-1 flex flex-col h-full">
    <div className="relative overflow-hidden">
      <img src={blog.thumbnail} alt={blog.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{blog.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm flex-grow">{blog.description}</p>
      <div className="mt-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-primary-100/50 dark:bg-primary-900/50 text-primary-800 dark:text-primary-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="flex justify-end space-x-4">
          <a href={blog.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-full shadow-md transition-all hover:scale-105">
            Read More
            <FiExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  </div>
);

// Grade Card Component
const GradeCard: React.FC<{ grade: typeof tutoringData[0] }> = ({ grade }) => (
  <Link to={`/tutoring/${grade.id}`} className="h-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border border-black/5 dark:border-white/10 relative overflow-hidden flex flex-col">
    <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative flex flex-col flex-grow">
      <grade.icon className="h-12 w-12 text-primary-500 mb-4 transition-colors group-hover:text-primary-600" />
      <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{grade.level}</h3>
      <p className="text-gray-600 dark:text-gray-300 flex-grow">{grade.description}</p>
    </div>
  </Link>
);

// Experience Card Component
const ExperienceCard: React.FC<{ item: Experience }> = ({ item }) => (
  <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-black/5 dark:border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.role}</h3>
    <p className="text-md font-semibold text-primary-600 dark:text-primary-400 mt-1">{item.company}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 my-2">{item.period}</p>
    <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
    {item.skills && (
      <div className="flex flex-wrap gap-2 mt-4">
        {item.skills.slice(0, 4).map(skill => (
          <span key={skill} className="bg-gray-200/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
        ))}
      </div>
    )}
  </div>
);

// Certification Card Component
const CertificationCard: React.FC<{ item: Certification }> = ({ item }) => (
  <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-black/5 dark:border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
        <p className="text-md text-gray-600 dark:text-gray-400 mt-1">{item.issuer}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{item.date}</p>
      </div>
      {item.credentialUrl && (
        <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 flex-shrink-0 ml-4 transition-colors">
          View
        </a>
      )}
    </div>
  </div>
);

// Lazy load sections for performance
const ProjectsSection = lazy(() => Promise.resolve({
  default: () => (
    <section className="py-20 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/50">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Featured Projects"
          subtitle="A selection of my recent work across different disciplines"
          link="/projects"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((project, index) => (
            <div key={project.id} className="animated-element animate-fade-in-up" style={{ '--stagger': index + 1 } as React.CSSProperties}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}));

const BlogSection = lazy(() => Promise.resolve({
  default: () => (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Latest Blog Posts"
          subtitle="Sharing my thoughts on technology, design, and more"
          link="/blog"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.slice(0, 3).map((blog, index) => (
            <div key={blog.id} className="animated-element animate-fade-in-up" style={{ '--stagger': index + 1 } as React.CSSProperties}>
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}));

const TutoringSection = lazy(() => Promise.resolve({
  default: () => (
    <section className="py-20 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/50 ">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Tutoring Programs"
          subtitle="Select a grade level to explore available lessons"
          link="/tutoring"
        />
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {tutoringData.map((grade, index) => (
            <div key={grade.id} className="animated-element animate-fade-in-up" style={{ '--stagger': index + 1 } as React.CSSProperties}>
              <GradeCard grade={grade} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}));

const CredentialsSection = lazy(() => Promise.resolve({
  default: () => (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Professional Journey"
          subtitle="My experience and career highlights"
          link="/credentials"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experience.slice(0, 3).map((item, index) => (
            <div key={item.id} className="animated-element animate-fade-in-up" style={{ '--stagger': index + 1 } as React.CSSProperties}>
              <ExperienceCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}));

const AchievementsSection = lazy(() => Promise.resolve({
  default: () => (
    <section className="py-20 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/50">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Achievements"
          subtitle="My certifications and professional accomplishments"
          link="/certifications-awards"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.slice(0, 3).map((item, index) => (
            <div key={item.id} className="animated-element animate-fade-in-up" style={{ '--stagger': index + 1 } as React.CSSProperties}>
              <CertificationCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}));

const ContactSection = lazy(() => Promise.resolve({
  default: () => (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Get In Touch"
          subtitle="I'd love to hear from you. Let's connect!"
          link="/contact"
        />
        <div className="max-w-2xl mx-auto bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-black/5 dark:border-white/10">
          <div className="text-center space-y-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Whether you have a project in mind, want to collaborate, or just want to say hello, feel free to reach out!
            </p>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                <strong className="text-gray-900 dark:text-white">Email:</strong>{' '}
                <a href={`mailto:${profileData.email}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                  {profileData.email}
                </a>
              </p>
              <div className="flex justify-center space-x-4 pt-4">
                {profileData.socials.map(social => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-2xl font-medium transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5"
            >
              Send Message
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}));

// Loading Fallback Component
const SectionLoader = () => (
  <div className="py-20">
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    </div>
  </div>
);

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Main Hero Section */}
      <div className="min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center relative">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Content */}
            <div className="flex-1 space-y-6 text-center lg:text-left order-2 lg:order-1">
              <div
                className="animated-element animate-fade-in-up inline-block"
                style={{ '--stagger': 1 } as React.CSSProperties}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 dark:bg-primary-400/10 text-primary-600 dark:text-primary-400 text-sm font-medium border border-primary-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                  </span>
                  Available for opportunities
                </span>
              </div>

              <h1
                className="animated-element animate-fade-in-up text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                style={{ '--stagger': 2 } as React.CSSProperties}
              >
                <span className="text-gray-900 dark:text-white">Hi, I'm</span>
                <br />
                <span className="bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  {profileData.name}
                </span>
              </h1>

              <p
                className="animated-element animate-fade-in-up text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light max-w-2xl mx-auto lg:mx-0"
                style={{ '--stagger': 3 } as React.CSSProperties}
              >
                {profileData.title}
              </p>

              <p
                className="animated-element animate-fade-in-up text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mx-0"
                style={{ '--stagger': 4 } as React.CSSProperties}
              >
                {profileData.shortBio}
              </p>

              {/* CTA Buttons */}
              <div
                className="animated-element animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
                style={{ '--stagger': 5 } as React.CSSProperties}
              >
                <Link
                  to="/projects"
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-2xl font-medium transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 hover:-translate-y-0.5"
                >
                  View My Work
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-900 dark:text-white rounded-2xl font-medium border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
                >
                  Get In Touch
                </Link>
              </div>

              {/* Social Links */}
              <div
                className="animated-element animate-fade-in-up flex items-center gap-4 justify-center lg:justify-start pt-4"
                style={{ '--stagger': 6 } as React.CSSProperties}
              >
                {profileData.socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right Content - Profile Image with Decorative Elements */}
            <div
              className="animated-element animate-fade-in-up flex-1 relative order-1 lg:order-2"
              style={{ '--stagger': 2 } as React.CSSProperties}
            >
              <div className="relative max-w-md mx-auto">
                {/* Decorative Gradient Blob */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-400 to-blue-400 dark:from-primary-500 dark:to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

                {/* Profile Image Container */}
                <div className="relative">
                  <div className="aspect-square rounded-full overflow-hidden border-4 border-white/50 dark:border-gray-800/50 shadow-2xl backdrop-blur-sm">
                    <img
                      src={profileData.profilePicture}
                      alt={profileData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Floating Skill Cards */}
                  <div className="absolute -top-4 -right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-gray-200 dark:border-gray-700 animate-bounce" style={{ animationDuration: '3s' }}>
                    <FiCode className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-gray-200 dark:border-gray-700 animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }}>
                    <FiPenTool className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
                  </div>
                  <div className="absolute top-1/2 -left-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-gray-200 dark:border-gray-700 animate-bounce" style={{ animationDuration: '3s', animationDelay: '2s' }}>
                    <FiBookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          {/* <div
            className="animated-element animate-fade-in-up mt-20 lg:mt-32"
            style={{ '--stagger': 7 } as React.CSSProperties}
          >
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center mb-6">
              Technologies I work with
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {profileData.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="group flex items-center gap-3 px-6 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 hover:border-primary-500/50 dark:hover:border-primary-400/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                  <skill.icon className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>

      {/* Lazy Loaded Sections */}
      <Suspense fallback={<SectionLoader />}>
        <ProjectsSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <BlogSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <TutoringSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <CredentialsSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <AchievementsSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <ContactSection />
      </Suspense>
    </div>
  );
};

export default HomePage;