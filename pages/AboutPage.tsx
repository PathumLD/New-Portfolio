
import React from 'react';
import { profileData } from '../data/profile';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12" style={{ '--stagger': 1 } as React.CSSProperties}>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          About Me
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">A little bit about my journey and passions.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-black/5 dark:border-white/10" style={{ '--stagger': 2 } as React.CSSProperties}>
        <img
          src={profileData.profilePicture}
          alt={profileData.name}
          className="w-48 h-48 rounded-full object-cover flex-shrink-0 shadow-xl border-4 border-white/20"
        />
        <div className="text-gray-700 dark:text-gray-300 space-y-4 whitespace-pre-line text-left">
            {profileData.longBio}
        </div>
      </div>

      <div className="mt-16" style={{ '--stagger': 3 } as React.CSSProperties}>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">My Skills</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {profileData.skills.map((skill, index) => (
            <div 
              key={skill.name} 
              className="flex items-center gap-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-black/5 dark:border-white/10"
              style={{ '--stagger': 4 + index } as React.CSSProperties}
            >
              <skill.icon className="h-6 w-6 text-primary-500"/>
              <span className="font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;