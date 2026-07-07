import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { blogs } from '../data/blogs';
import { Blog } from '../types';
import { Pill, SectionIntro, SmartLink, Surface } from '../components/PublicUI';

const BlogCard: React.FC<{ blog: Blog; featured?: boolean }> = ({ blog, featured = false }) => (
  <Surface className={`group overflow-hidden ${featured ? 'lg:grid lg:grid-cols-[1.05fr_0.95fr]' : 'flex h-full flex-col'}`}>
    <div className={`overflow-hidden bg-zinc-900 ${featured ? 'min-h-[22rem]' : 'aspect-[16/10]'}`}>
      <img src={blog.thumbnail} alt={blog.title} className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
    </div>
    <div className="flex flex-1 flex-col p-5 md:p-6">
      <div className="flex flex-wrap gap-2">
        {blog.tags.map((tag, index) => (
          <Pill key={tag} tone={index === 0 ? 'emerald' : 'neutral'}>
            {tag}
          </Pill>
        ))}
      </div>
      <h2 className={`${featured ? 'text-3xl md:text-4xl' : 'text-2xl'} mt-5 font-semibold tracking-tight text-zinc-950 dark:text-white`}>
        {blog.title}
      </h2>
      <p className="mt-4 flex-1 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{blog.description}</p>
      <SmartLink href={blog.url} external className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
        Read article
        <FiExternalLink className="h-4 w-4" />
      </SmartLink>
    </div>
  </Surface>
);

const BlogPage: React.FC = () => {
  const [featuredBlog, ...restBlogs] = blogs;

  if (!featuredBlog) {
    return (
      <div className="space-y-14">
        <SectionIntro
          eyebrow="Blog"
          title="Writing about development, design, and better digital products."
          description="No verified published articles were listed in the provided documents yet."
          align="center"
        />
      </div>
    );
  }

  return (
    <div className="space-y-14">
      <SectionIntro
        eyebrow="Blog"
        title="Writing about development, design, and better digital products."
        description="Short notes and guides from the intersection of technical implementation and visual craft."
        align="center"
      />

      {featuredBlog && <BlogCard blog={featuredBlog} featured />}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {restBlogs.map((blog, index) => (
          <div key={blog.id} className="animated-element animate-fade-in-up" style={{ '--stagger': index + 1 } as React.CSSProperties}>
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
