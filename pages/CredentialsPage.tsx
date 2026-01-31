
import React from 'react';
import TabbedContent from '../components/TabbedContent';
import { education } from '../data/education';
import { experience } from '../data/experience';
import { volunteering } from '../data/volunteering';
import { Education, Experience, Volunteering } from '../types';

const InfoCard: React.FC<{ item: Education | Experience | Volunteering; alignment: 'left' | 'right' }> = ({ item, alignment }) => (
  <div className="bg-white/30 dark:bg-dark-background/30 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-black/5 dark:border-white/10 w-full text-left">
    {'degree' in item && <h3 className="text-xl font-bold text-[#1c1a1c] dark:text-white">{item.degree}</h3>}
    {'role' in item && <h3 className="text-xl font-bold text-[#1c1a1c] dark:text-white">{item.role}</h3>}

    <p className="text-md font-semibold text-green-600 dark:text-green-400 mt-1">
      {'institution' in item && item.institution}
      {'company' in item && item.company}
      {'organization' in item && item.organization}
    </p>

    <p className="text-sm text-[#1c1a1c]/60 dark:text-white/60 my-2">{item.period}</p>
    <p className="text-[#1c1a1c]/80 dark:text-white/80">{item.description}</p>
    {'skills' in item && item.skills && (
      <div className={`flex flex-wrap gap-2 mt-4 ${alignment === 'right' ? 'sm:justify-end' : 'justify-start'}`}>
        {item.skills.map(skill => (
          <span key={skill} className="bg-primary-100/30 dark:bg-primary-900/20 text-[#1c1a1c]/90 dark:text-white/90 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
        ))}
      </div>
    )}
  </div>
);

const Timeline: React.FC<{ items: (Education | Experience | Volunteering)[] }> = ({ items }) => (
  <div className="relative">
    {/* Vertical line */}
    <div className="absolute left-4 sm:left-1/2 top-1 h-full w-0.5 bg-green-200 dark:bg-green-800 transform sm:-translate-x-1/2"></div>

    <div className="space-y-12">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="relative animated-element animate-fade-in-up"
          style={{ '--stagger': index + 1 } as React.CSSProperties}
        >
          <div className="sm:flex items-start">
            {/* Dot */}
            <div className="hidden sm:block absolute left-1/2 top-1 w-5 h-5 rounded-full bg-green-500 border-4 border-white dark:border-dark-background transform -translate-x-1/2 z-10"></div>
            <div className="sm:hidden absolute left-4 top-1 w-5 h-5 rounded-full bg-green-500 border-4 border-white dark:border-dark-background transform -translate-x-1/2 z-10"></div>

            {/* Content Card */}
            <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? 'sm:pr-8' : 'sm:pl-8 sm:ml-auto'}`}>
              <InfoCard item={item} alignment={index % 2 !== 0 ? 'left' : 'right'} />
            </div>
          </div>
          {/* Mobile view needs a different structure to align with the line */}
          <div className="sm:hidden -mt-[calc(100%-1.25rem)] ml-10">
            <InfoCard item={item} alignment='left' />
          </div>
        </div>
      ))}
    </div>
  </div>
);


const CredentialsPage: React.FC = () => {
  const tabs = [
    {
      label: 'Experience',
      content: <Timeline items={experience} />,
    },
    {
      label: 'Education',
      content: <Timeline items={education} />,
    },
    {
      label: 'Volunteering',
      content: <Timeline items={volunteering} />,
    },
  ];

  return (
    <div>
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-[#1c1a1c] dark:text-white sm:text-5xl">My Journey</h1>
        <p className="mt-4 text-xl text-[#1c1a1c]/70 dark:text-white/70">My professional and academic journey.</p>
      </div>
      <div className="max-w-4xl mx-auto">
        <TabbedContent tabs={tabs} />
      </div>
    </div>
  );
};

export default CredentialsPage;


