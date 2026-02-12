import { Component, signal, inject } from '@angular/core';
import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { CardFlipComponent } from '../../shared/components/card-flip/card-flip.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { Skill, Technologies, FeaturedProject } from '../../core/models/portfolio.models';

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, CardFlipComponent, HeaderComponent ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private readonly document = inject(DOCUMENT);

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
