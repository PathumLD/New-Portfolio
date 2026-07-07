import React, { ReactNode, useState } from 'react';

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
      <div className="mb-8 overflow-x-auto no-scrollbar">
        <nav className="inline-flex min-w-full border border-zinc-200 bg-white/70 p-1 dark:border-white/10 dark:bg-white/5 sm:min-w-0" role="tablist">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActiveTab(index)}
              role="tab"
              aria-selected={activeTab === index}
              className={`min-h-10 whitespace-nowrap px-4 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:px-5 ${
                activeTab === index
                  ? 'bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div role="tabpanel">{tabs[activeTab]?.content}</div>
    </div>
  );
};

export default TabbedContent;
