import React from 'react';
import { blogs } from '../data/blogs';
import { Blog } from '../types';
import { FiExternalLink } from 'react-icons/fi';

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
            {blog.tags.map(tag => (
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


const BlogPage: React.FC = () => {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">My Blog</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Sharing my thoughts on technology, design, and more.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog, index) => (
            <div key={blog.id} className="animated-element animate-fade-in-up" style={{ '--stagger': index + 1 } as React.CSSProperties}>
                <BlogCard blog={blog} />
            </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;