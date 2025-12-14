
import React from 'react';
import { profileData } from '../data/profile';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-500 dark:text-gray-400">
        <div className="flex justify-center space-x-6 mb-4">
          {profileData.socials.map((social) => (
            <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300">
              <social.icon className="h-6 w-6" />
              <span className="sr-only">{social.name}</span>
            </a>
          ))}
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} {profileData.name}. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;