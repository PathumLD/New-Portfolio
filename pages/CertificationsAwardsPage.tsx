
import React from 'react';
import TabbedContent from '../components/TabbedContent';
import { certifications } from '../data/certifications';
import { awards } from '../data/awards';
import { Certification, Award } from '../types';

const CertAwardCard: React.FC<{ item: Certification | Award }> = ({ item }) => (
    <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg p-6 rounded-2xl shadow-lg mb-6 transition-all hover:shadow-xl border border-black/5 dark:border-white/10">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-md text-gray-600 dark:text-gray-400 mt-1">{item.issuer}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{item.date}</p>
            </div>
            {'credentialUrl' in item && item.credentialUrl && (
                <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 flex-shrink-0 ml-4 transition-colors">
                    View Credential
                </a>
            )}
        </div>
        {'description' in item && <p className="text-gray-700 dark:text-gray-300 mt-4">{item.description}</p>}
    </div>
);

const CertsAwardsList: React.FC<{ items: (Certification | Award)[] }> = ({ items }) => (
  <div>
    {items.map((item, index) => (
      <div key={item.id} className="animated-element animate-fade-in-up" style={{ '--stagger': index + 1 } as React.CSSProperties}>
        <CertAwardCard item={item} />
      </div>
    ))}
  </div>
);


const CertificationsAwardsPage: React.FC = () => {
  const tabs = [
    {
      label: 'Certifications',
      content: <CertsAwardsList items={certifications} />,
    },
    {
      label: 'Awards',
      content: <CertsAwardsList items={awards} />,
    },
  ];

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Achievements</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">My certifications and awards.</p>
      </div>
      <div className="max-w-4xl mx-auto">
        <TabbedContent tabs={tabs} />
      </div>
    </div>
  );
};

export default CertificationsAwardsPage;