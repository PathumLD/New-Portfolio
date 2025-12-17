import { ProfileData } from '../types';
import { FaGithub, FaLinkedin, FaTwitter, FaReact, FaFigma } from 'react-icons/fa';
import { SiTailwindcss, SiTypescript } from 'react-icons/si';
import profile from '../assets/profile.jpg';

export const profileData: ProfileData = {
  name: 'Pathum Dissanayake',
  title: 'Software Engineer, Designer & Educator',
  email: 'pathumlk.diz@example.com',
  phone: '+94 77 123 4567',
  location: 'Colombo, Sri Lanka',
  age: 28,
  yearsOfExperience: 5,
  availability: 'Available for freelance',
  languages: ['English', 'Sinhala', 'Tamil'],
  education: 'BSc in Computer Science, University of Colombo',
  profilePicture: profile,
  shortBio: 'A creative professional passionate about building beautiful, functional applications and sharing knowledge with others.',
  longBio: `
    I am a multi-disciplinary professional with a deep passion for technology, design, and education. As a Software Engineer, I specialize in front-end development, crafting intuitive and performant user interfaces with modern technologies like React and TypeScript. My journey into development was fueled by a love for visual aesthetics, which I also express through my work as a Graphic Designer, creating compelling brand identities and digital art.
    
    Beyond building and designing, I believe in the power of sharing knowledge. I maintain a tech blog where I write about the latest trends in web development and design, and I have experience as a part-time coding instructor, helping aspiring developers start their careers. My unique blend of technical expertise, design sensibility, and communication skills allows me to bridge the gap between complex engineering challenges and user-centric design.
    `,
  skills: [
    { name: 'React', icon: FaReact },
    { name: 'TypeScript', icon: SiTypescript },
    { name: 'Tailwind CSS', icon: SiTailwindcss },
    { name: 'Figma', icon: FaFigma },
    { name: 'Figma', icon: FaFigma },
    { name: 'Figma', icon: FaFigma },
    { name: 'Figma', icon: FaFigma },
    { name: 'Figma', icon: FaFigma },
    { name: 'Figma', icon: FaFigma },
    { name: 'Figma', icon: FaFigma },
  ],
  socials: [
    { name: 'GitHub', url: 'https://github.com', icon: FaGithub },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: FaLinkedin },
    { name: 'Twitter', url: 'https://twitter.com', icon: FaTwitter },
  ],
};