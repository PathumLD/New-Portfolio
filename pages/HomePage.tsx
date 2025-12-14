import React from 'react';
import { Link } from 'react-router-dom';
import { profileData } from '../data/profile';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 md:py-24">
      <img
        src={profileData.profilePicture}
        alt={profileData.name}
        style={{ '--stagger': 1 } as React.CSSProperties}
        className="animated-element animate-fade-in-up w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mb-6 shadow-2xl border-4 border-white/20"
      />
      <h1
        style={{ '--stagger': 2 } as React.CSSProperties}
        className="animated-element animate-fade-in-up text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tighter">
        Hi, I'm <span className="bg-clip-text text-transparent bg-primary-500">{profileData.name}</span>
      </h1>
      <p
        style={{ '--stagger': 3 } as React.CSSProperties}
        className="animated-element animate-fade-in-up mt-3 text-lg md:text-2xl font-medium text-gray-600 dark:text-gray-300">
        {profileData.title}
      </p>
      <p
        style={{ '--stagger': 4 } as React.CSSProperties}
        className="animated-element animate-fade-in-up mt-4 max-w-2xl text-base md:text-lg text-gray-500 dark:text-gray-400">
        {profileData.shortBio}
      </p>
      <div
        style={{ '--stagger': 5 } as React.CSSProperties}
        className="animated-element animate-fade-in-up mt-8 flex flex-col sm:flex-row gap-4">
        <Link
          to="/projects"
          className="px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 transition-transform transform hover:scale-105 shadow-lg animate-pulse-glow"
        >
          View My Work
        </Link>
        <Link
          to="/contact"
          className="px-8 py-3 text-base font-medium rounded-full text-primary-700 dark:text-primary-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-black/5 dark:border-white/10 hover:bg-white dark:hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
        >
          Get In Touch
        </Link>
      </div>
    </div>
  );
};

export default HomePage;