import { Grade } from '../types';
import { FiBookOpen, FiCpu } from 'react-icons/fi';

export const tutoringData: Grade[] = [
  {
    id: 'grade-6-ict',
    level: 'Grade 6 - ICT',
    description: 'Introductory ICT lessons that help younger learners understand computers, digital tools, files, and safe technology habits.',
    icon: FiBookOpen,
    lessons: [
      {
        id: 'grade-6-computer-basics',
        title: 'Computer Basics',
        description: 'Learn the main parts of a computer, input and output devices, file handling, and everyday ICT vocabulary.',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'grade-6-digital-safety',
        title: 'Digital Safety',
        description: 'Understand responsible device use, passwords, online safety, and respectful behavior in digital spaces.',
        thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    id: 'grade-7-ict',
    level: 'Grade 7 - ICT',
    description: 'Build confidence with operating systems, documents, spreadsheets, presentations, and basic problem-solving.',
    icon: FiCpu,
    lessons: [
      {
        id: 'grade-7-productivity-tools',
        title: 'Productivity Tools',
        description: 'Practice document formatting, spreadsheet basics, presentations, and organizing schoolwork digitally.',
        thumbnail: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'grade-7-operating-systems',
        title: 'Operating Systems',
        description: 'Explore desktop environments, storage, settings, folders, and basic troubleshooting steps.',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    id: 'grade-8-ict',
    level: 'Grade 8 - ICT',
    description: 'Strengthen ICT foundations with data representation, internet concepts, simple algorithms, and practical software use.',
    icon: FiBookOpen,
    lessons: [
      {
        id: 'grade-8-data-and-information',
        title: 'Data and Information',
        description: 'Learn how data becomes useful information through collection, organization, processing, and presentation.',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'grade-8-intro-algorithms',
        title: 'Introduction to Algorithms',
        description: 'Use step-by-step thinking, flowcharts, and simple logic to understand how computers solve problems.',
        thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    id: 'grade-9-ict',
    level: 'Grade 9 - ICT',
    description: 'Practical ICT lessons covering web fundamentals, databases, networking basics, and structured problem-solving.',
    icon: FiCpu,
    lessons: [
      {
        id: 'grade-9-web-fundamentals',
        title: 'Web Fundamentals',
        description: 'Understand how websites work through HTML, CSS, browsers, links, media, and page structure.',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'grade-9-database-basics',
        title: 'Database Basics',
        description: 'Learn tables, records, fields, relationships, and why organized data matters in real systems.',
        thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    id: 'grade-10-ict',
    level: 'Grade 10 - ICT',
    description: 'Ordinary Level ICT preparation focused on programming concepts, databases, networks, and exam-ready understanding.',
    icon: FiBookOpen,
    lessons: [
      {
        id: 'grade-10-programming-concepts',
        title: 'Programming Concepts',
        description: 'Study variables, control structures, logic, debugging, and algorithmic thinking through simple examples.',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'grade-10-networking-basics',
        title: 'Networking Basics',
        description: 'Explore network types, devices, internet services, data communication, and security fundamentals.',
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  {
    id: 'grade-11-ict',
    level: 'Grade 11 - ICT',
    description: 'Final Ordinary Level ICT revision with structured theory, practical application, past-paper practice, and confidence building.',
    icon: FiCpu,
    lessons: [
      {
        id: 'grade-11-ol-revision',
        title: 'O/L ICT Revision',
        description: 'Review key syllabus areas, common question patterns, short-note strategies, and practical answer structure.',
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
      },
      {
        id: 'grade-11-past-papers',
        title: 'Past Paper Practice',
        description: 'Work through model and past-paper style questions with explanations, timing practice, and correction guidance.',
        thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
];
