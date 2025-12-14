import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { tutoringData } from '../data/tutoring';
import { Grade, Lesson } from '../types';

const LessonCard: React.FC<{ lesson: Lesson }> = ({ lesson }) => (
  <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20 transform hover:-translate-y-1 flex flex-col h-full">
    <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-48 object-cover" />
    <div className="p-6 flex-grow flex flex-col">
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{lesson.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm flex-grow">{lesson.description}</p>
      <div className="mt-auto">
         <a href="#" className="inline-block text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-full shadow-md transition-all hover:scale-105">
            Start Lesson
        </a>
      </div>
    </div>
  </div>
);

const GradeCard: React.FC<{ grade: Grade }> = ({ grade }) => (
    <Link to={`/tutoring/${grade.id}`} className="h-full bg-white/30 dark:bg-gray-800/30 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border border-black/5 dark:border-white/10 relative overflow-hidden flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex flex-col flex-grow">
          <grade.icon className="h-12 w-12 text-primary-500 mb-4 transition-colors group-hover:text-primary-600" />
          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{grade.level}</h3>
          <p className="text-gray-600 dark:text-gray-300 flex-grow">{grade.description}</p>
        </div>
    </Link>
);

const TutoringPage: React.FC = () => {
  const { gradeId } = useParams<{ gradeId: string }>();
  const selectedGrade = gradeId ? tutoringData.find(g => g.id === gradeId) : null;

  if (selectedGrade) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link to="/tutoring" className="text-primary-600 dark:text-primary-400 hover:underline">&larr; Back to All Grades</Link>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">{selectedGrade.level}</h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Explore the lessons available for this grade.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedGrade.lessons.map((lesson, index) => <div key={lesson.id} className="animated-element animate-fade-in-up" style={{ '--stagger': index + 1 } as React.CSSProperties}><LessonCard lesson={lesson} /></div>)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">Tutoring Programs</h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Select a grade level to see available lessons.</p>
      </div>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {tutoringData.map((grade, index) => <div key={grade.id} className="animated-element animate-fade-in-up" style={{ '--stagger': index + 1 } as React.CSSProperties}><GradeCard grade={grade} /></div>)}
      </div>
    </div>
  );
};

export default TutoringPage;