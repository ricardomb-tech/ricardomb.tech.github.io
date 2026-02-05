import { Component, signal, inject } from '@angular/core';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { RouterLink } from "@angular/router";

interface NavigationItem {
  id: number;
  label: string;
  route: string;
  fragment?: string;
}
interface Skill {
  id: number;
  name: string;
  description: string;
}
interface Technologies {
  id: number;
  name: string;
  category: string;
}
interface FeaturedProject {
  id: number;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private readonly document = inject(DOCUMENT);

  readonly navigation= signal<NavigationItem[]>([
    {id:1, label: 'Acerca de mi', route: '/', fragment:undefined },
    {id:2, label: 'Proyectos', route: '/', fragment:undefined },
    {id:3, label: 'Experiencia', route: '/', fragment:undefined },
  ]);

  readonly skills= signal<Skill[]>([
     {
      id: 1,
      name: 'Desarrollo Frontend',
      description: 'Experiencia con Angular, TypeScript y Tailwind CSS.',
    },
    {
      id: 2,
      name: 'Desarrollo Backend',
      description: 'APIs REST con Node.js, NestJS y bases de datos SQL/NoSQL.',
    },
  ]);

  readonly technologies= signal<Technologies[]>([
    { id: 1, name: 'Angular', category: 'Frontend' },
    { id: 2, name: 'TypeScript', category: 'Frontend' },
    { id: 3, name: 'Tailwind CSS', category: 'Frontend' },
    { id: 4, name: 'Node.js', category: 'Backend' },
    { id: 5, name: 'NestJS', category: 'Backend' },
    { id: 6, name: 'MongoDB', category: 'Database' },
    { id: 7, name: 'PostgreSQL', category: 'Database' },
  ]);

  readonly featuredProjects = signal<FeaturedProject[]>([
    {
      id: 1,
      name: 'Mi Proyecto',
      tagline: 'Proyecto destacado',
      description: 'Descripción breve del proyecto.',
      stack: ['Angular', 'TypeScript', 'TailwindCSS'],
    },
  ]);

  scrollToSection(targetId: string): void {
    const target = this.document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
