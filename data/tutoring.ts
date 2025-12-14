import { Grade } from '../types';
import { FiBookOpen } from 'react-icons/fi';
import { FaFlask } from 'react-icons/fa';

export const tutoringData: Grade[] = [
  {
    id: 'grade-9-math',
    level: 'Grade 9 - Mathematics',
    description: 'Master fundamental concepts of algebra, geometry, and trigonometry essential for higher studies.',
    icon: FiBookOpen,
    lessons: [
      {
        id: 'alg-101',
        title: 'Introduction to Algebra',
        description: 'Learn about variables, expressions, and solving linear equations. This is the foundation of all math.',
        thumbnail: 'https://picsum.photos/seed/math1/600/400',
      },
      {
        id: 'geo-101',
        title: 'Geometry Basics',
        description: 'Explore shapes, angles, and proofs. Understand the properties of triangles and circles.',
        thumbnail: 'https://picsum.photos/seed/math2/600/400',
      },
    ],
  },
  {
    id: 'grade-10-science',
    level: 'Grade 10 - Science',
    description: 'Dive into the world of biology, chemistry, and physics with hands-on examples and experiments.',
    icon: FaFlask,
    lessons: [
      {
        id: 'bio-101',
        title: 'Cellular Biology',
        description: 'Discover the building blocks of life. An in-depth look at cell structure and function.',
        thumbnail: 'https://picsum.photos/seed/science1/600/400',
      },
      {
        id: 'chem-101',
        title: 'Chemical Reactions',
        description: 'Understand how substances interact and change. Balance equations and predict reaction outcomes.',
        thumbnail: 'https://picsum.photos/seed/science2/600/400',
      },
      {
        id: 'phy-101',
        title: 'Introduction to Motion',
        description: 'Learn about Newton\'s laws of motion, speed, velocity, and acceleration.',
        thumbnail: 'https://picsum.photos/seed/science3/600/400',
      },
    ],
  },
];