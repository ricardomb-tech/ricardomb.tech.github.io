export interface Project {
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
