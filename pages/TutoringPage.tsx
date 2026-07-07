import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen } from 'react-icons/fi';
import { tutoringData } from '../data/tutoring';
import { Grade, Lesson } from '../types';
import { Pill, SectionIntro, Surface } from '../components/PublicUI';

const LessonCard: React.FC<{ lesson: Lesson }> = ({ lesson }) => (
  <Surface className="group flex h-full flex-col overflow-hidden">
    <div className="aspect-[16/10] overflow-hidden bg-zinc-900">
      <img src={lesson.thumbnail} alt={lesson.title} className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
    </div>
    <div className="flex flex-1 flex-col p-5">
      <h3 className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">{lesson.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{lesson.description}</p>
      <a href="https://class.pathumld.com/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center justify-center bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400">
        Start lesson
      </a>
    </div>
  </Surface>
);

const GradeCard: React.FC<{ grade: Grade }> = ({ grade }) => (
  <Link to={`/tutoring/${grade.id}`} className="block h-full">
    <Surface className="h-full p-6 transition hover:-translate-y-1 hover:border-emerald-500/60">
      <grade.icon className="h-10 w-10 text-emerald-500" />
      <h3 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">{grade.level}</h3>
      <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{grade.description}</p>
      <div className="mt-5">
        <Pill tone="cyan">{grade.lessons.length} lessons</Pill>
      </div>
    </Surface>
  </Link>
);

const TutoringPage: React.FC = () => {
  const { gradeId } = useParams<{ gradeId: string }>();
  const selectedGrade = gradeId ? tutoringData.find((grade) => grade.id === gradeId) : null;

  if (selectedGrade) {
    return (
      <div className="space-y-12">
        <Link to="/tutoring" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          <FiArrowLeft className="h-4 w-4" />
          Back to all grades
        </Link>
        <SectionIntro eyebrow="Tutoring" title={selectedGrade.level} description="Explore the lessons available for this grade." align="center" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {selectedGrade.lessons.map((lesson, index) => (
            <div key={lesson.id} className="animated-element animate-fade-in-up" style={{ '--stagger': index + 1 } as React.CSSProperties}>
              <LessonCard lesson={lesson} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <SectionIntro eyebrow="Tutoring" title="Structured lessons for focused learners." description="Select a grade level to see available lessons." align="center" />
      <Surface className="p-6">
        <div className="flex items-center gap-3">
          <FiBookOpen className="h-7 w-7 text-emerald-500" />
          <Pill tone="emerald">Programs</Pill>
        </div>
      </Surface>
      <div className="grid gap-5 md:grid-cols-3">
        {tutoringData.map((grade, index) => (
          <div key={grade.id} className="animated-element animate-fade-in-up" style={{ '--stagger': index + 1 } as React.CSSProperties}>
            <GradeCard grade={grade} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutoringPage;
