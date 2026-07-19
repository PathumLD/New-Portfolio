import React, { useEffect, useState } from 'react';
import { FiAward, FiExternalLink } from 'react-icons/fi';
import TabbedContent from '../components/TabbedContent';
import { awards as fallbackAwards } from '../data/awards';
import { certifications as fallbackCertifications } from '../data/certifications';
import { Award, Certification } from '../types';
import { Pill, SectionIntro, SmartLink, Surface } from '../components/PublicUI';
import { awardsService, certificatesService } from '../src/services';
import type { Award as DatabaseAward, Certificate as DatabaseCertificate } from '../src/types/database.types';

const AchievementCard: React.FC<{ item: Certification | Award; index: number }> = ({ item, index }) => (
  <Surface className="p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center border border-emerald-500/30 bg-emerald-500/10 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">{item.title}</h3>
          <p className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{item.issuer}</p>
          {'description' in item && <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{item.description}</p>}
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-3">
        <Pill tone="amber">{item.date}</Pill>
        {'credentialUrl' in item && item.credentialUrl && (
          <SmartLink href={item.credentialUrl} external className="inline-flex items-center gap-2 border-b border-emerald-500 pb-1 text-sm font-semibold text-zinc-950 dark:text-white">
            View
            <FiExternalLink className="h-4 w-4" />
          </SmartLink>
        )}
      </div>
    </div>
  </Surface>
);

const AchievementList: React.FC<{ items: (Certification | Award)[] }> = ({ items }) => {
  if (items.length === 0) {
    return <Surface className="p-8 text-center text-zinc-600 dark:text-zinc-300">No verified entries listed in the provided documents yet.</Surface>;
  }

  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <AchievementCard key={item.id} item={item} index={index} />
      ))}
    </div>
  );
};

const achievementDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
});

function formatAchievementDate(date: string) {
  return achievementDateFormatter.format(new Date(`${date}T00:00:00`));
}

function mapDatabaseCertificate(item: DatabaseCertificate): Certification {
  return {
    id: item.id,
    title: item.name,
    issuer: item.organization,
    date: formatAchievementDate(item.issued_date),
    credentialUrl: item.credential_link || item.document_url || undefined,
  };
}

function mapDatabaseAward(item: DatabaseAward): Award {
  return {
    id: item.id,
    title: item.name,
    issuer: item.organization,
    date: formatAchievementDate(item.issued_date),
    description: item.description || '',
  };
}

const CertificationsAwardsPage: React.FC = () => {
  const [certificationItems, setCertificationItems] = useState<Certification[]>(fallbackCertifications);
  const [awardItems, setAwardItems] = useState<Award[]>(fallbackAwards);

  useEffect(() => {
    let isMounted = true;

    const loadAchievements = async () => {
      try {
        const [certificateData, awardData] = await Promise.all([
          certificatesService.getAll(),
          awardsService.getAll(),
        ]);

        if (!isMounted) return;

        if (certificateData.length > 0) setCertificationItems(certificateData.map(mapDatabaseCertificate));
        if (awardData.length > 0) setAwardItems(awardData.map(mapDatabaseAward));
      } catch (error) {
        console.error('Unable to load achievements from Supabase:', error);
      }
    };

    loadAchievements();

    return () => {
      isMounted = false;
    };
  }, []);

  const tabs = [
    { label: 'Certifications', content: <AchievementList items={certificationItems} /> },
    { label: 'Awards', content: <AchievementList items={awardItems} /> },
  ];

  return (
    <div className="space-y-14">
      <SectionIntro
        eyebrow="Achievements"
        title="Certifications, awards, and proof of continuous learning."
        description="A concise record of credentials and recognition across development, design, and professional growth."
        align="center"
      />

      <Surface className="grid gap-5 p-5 md:grid-cols-3">
        <div className="md:col-span-1">
          <FiAward className="h-8 w-8 text-amber-500" />
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">Achievement archive</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
          <div className="border-l-2 border-emerald-500 pl-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Certifications</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">{certificationItems.length}</p>
          </div>
          <div className="border-l-2 border-cyan-500 pl-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">Awards</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-950 dark:text-white">{awardItems.length}</p>
          </div>
        </div>
      </Surface>

      <div className="mx-auto max-w-5xl">
        <TabbedContent tabs={tabs} />
      </div>
    </div>
  );
};

export default CertificationsAwardsPage;
