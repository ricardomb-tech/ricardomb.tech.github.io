export interface Project {
[x: string]: any;
  id: number;
  title: string;
  description: string;
  technologies: string[];
  repoUrl: string;
  liveUrl?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Skill {
  id: number;
  name: string;
  description: string;
}

export interface Technologies {
  id: number;
  name: string;
  category: string;
}

export interface FeaturedProject {
  id: number;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
}
