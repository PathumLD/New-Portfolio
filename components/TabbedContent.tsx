import React, { useState, ReactNode } from 'react';

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabbedContentProps {
  tabs: Tab[];
}

const TabbedContent: React.FC<TabbedContentProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <nav className="bg-green-100/30 dark:bg-green-900/20 p-1.5 rounded-2xl flex flex-wrap justify-center gap-1 sm:gap-2">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(index)}
              role="tab"
              aria-selected={activeTab === index}
              className={`whitespace-nowrap py-2 px-4 sm:px-6 rounded-full font-medium text-sm sm:text-base transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${activeTab === index
                  ? 'bg-white dark:bg-dark-background text-green-600 dark:text-green-300 shadow-sm'
                  : 'text-[#1c1a1c]/60 hover:text-[#1c1a1c] dark:text-white/60 dark:hover:text-white hover:bg-white/50 dark:hover:bg-green-900/30'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div role="tabpanel">
        {tabs[activeTab] && tabs[activeTab].content}
      </div>
    </div>
  );
};

export default TabbedContent;
