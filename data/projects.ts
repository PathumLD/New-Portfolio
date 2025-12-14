
import { Project, ProjectCategory } from '../types';

export const projects: Project[] = [
  {
    id: 1,
    title: 'EcoSort AI',
    category: ProjectCategory.WEB_APP,
    image: 'https://picsum.photos/seed/project1/600/400',
    description: 'A web application that uses machine learning to identify recyclable materials from an uploaded image, promoting environmental awareness.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Python', 'Flask'],
    liveUrl: '#',
    repoUrl: '#',
  },
  {
    id: 2,
    title: 'Mindful Moments',
    category: ProjectCategory.MOBILE_APP,
    image: 'https://picsum.photos/seed/project2/600/400',
    description: 'A cross-platform mobile app for guided meditation and mindfulness exercises, built with React Native.',
    tags: ['React Native', 'Firebase', 'Redux'],
  },
  {
    id: 3,
    title: 'Artisan Coffee Co.',
    category: ProjectCategory.WEBSITES,
    image: 'https://picsum.photos/seed/project3/600/400',
    description: 'A fully responsive e-commerce website for a boutique coffee brand, focusing on a clean aesthetic and seamless user experience.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Shopify'],
    liveUrl: '#',
  },
  {
    id: 4,
    title: 'ProjectHub Dashboard',
    category: ProjectCategory.UI_UX,
    image: 'https://picsum.photos/seed/project4/600/400',
    description: 'A complete UI/UX design case study for a project management dashboard, created in Figma. Includes user personas, wireframes, and high-fidelity prototypes.',
    tags: ['Figma', 'User Research', 'Prototyping'],
    liveUrl: '#',
  },
  {
    id: 5,
    title: 'Synthwave Dreams',
    category: ProjectCategory.GRAPHIC_DESIGN,
    image: 'https://picsum.photos/seed/project5/600/400',
    description: 'A series of graphic design posters and branding materials inspired by 80s synthwave music and aesthetics.',
    tags: ['Adobe Illustrator', 'Adobe Photoshop', 'Branding'],
  },
   {
    id: 6,
    title: 'CloudNote',
    category: ProjectCategory.WEB_APP,
    image: 'https://picsum.photos/seed/project6/600/400',
    description: 'A real-time collaborative note-taking application. Users can create, share, and edit notes simultaneously with rich text formatting.',
    tags: ['React', 'Node.js', 'Socket.IO', 'MongoDB'],
    liveUrl: '#',
    repoUrl: '#',
  },
];
