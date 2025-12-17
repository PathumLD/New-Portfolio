import { IconType } from 'react-icons';

export enum ProjectCategory {
  WEB_APP = 'Web Apps',
  MOBILE_APP = 'Mobile Apps',
  WEBSITES = 'Websites',
  UI_UX = 'UI/UX',
  GRAPHIC_DESIGN = 'Graphic Designs',
}

export interface Project {
  id: number;
  title: string;
  category: ProjectCategory;
  image: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
}

export interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface Award {
  id: number;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  period: string;
  description: string;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string;
  skills: string[];
}

export interface Volunteering {
  id: number;
  organization: string;
  role: string;
  period: string;
  description: string;
}

export interface ProfileData {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location: string;
  age?: number;
  yearsOfExperience: number;
  availability: string;
  languages: string[];
  education: string;
  shortBio: string;
  longBio: string;
  profilePicture: string;
  skills: { name: string; icon: IconType }[];
  socials: { name: string; url: string; icon: IconType }[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

export interface Grade {
  id: string;
  level: string;
  description: string;
  icon: IconType;
  lessons: Lesson[];
}

export interface Blog {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  url: string;
}