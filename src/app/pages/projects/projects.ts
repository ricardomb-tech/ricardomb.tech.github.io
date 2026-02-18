import { Component, computed, effect, signal, ChangeDetectionStrategy } from '@angular/core';
import { PortfolioData } from '../../core/services/portfolio-data';
import { Project } from '../../core/models/portfolio.models';
import { HeaderComponent } from "../../shared/components/header/header.component";

type CarouselSlide = {
  image: string;
  alt: string;
  title: string;
  description: string;
  technologies: string[];
};

@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrl: './projects.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeaderComponent]
})
export class Projects {
  private portfolioData = new PortfolioData();

  readonly projects = signal<Project[]>([]);
  readonly activeIndex = signal(0);

  // Slides para el hero carousel
  readonly carouselSlides = signal<CarouselSlide[]>([
    {
      image: '/assets/image/foto9.png',
      alt: 'Angular Logo',
      title: 'Mi Portafolio',
      description: 'Aplicación web personal construida con Angular, signals y mejores prácticas modernas.',
      technologies: ['Angular', 'TypeScript', 'Signals']
    },
    {
      image: '/assets/image/foto11.png',
      alt: 'Proyecto Genérico',
      title: 'Proyecto Genérico',
      description: 'Ejemplo de proyecto destacado en el carrusel.',
      technologies: ['RxJS', 'NgOptimizedImage', 'SCSS']
    }
    // Puedes agregar más slides aquí
  ]);
  readonly currentSlide = signal(0);

  constructor() {
    this.portfolioData.getProjects().subscribe((data) => {
      this.projects.set(data.map(p => ({
        ...p,
        image: this.getImageForProject(p)
      })));
    });
    this.startCarousel();
    this.startHeroCarousel();
  }

  getImageForProject(project: Project): string | undefined {
    // Puedes personalizar la lógica para asociar imágenes
    if (project.title === 'Mi Portafolio') {
      return '/assets/image/logos/angular.svg';
    }
    return '/assets/image/logos/default.svg';
  }

  startCarousel() {
    setInterval(() => {
      const total = this.projects().length;
      if (total > 1) {
        this.activeIndex.update(i => (i + 1) % total);
      }
    }, 3000);
  }

  // Métodos para el hero carousel
  startHeroCarousel() {
    setInterval(() => {
      const total = this.carouselSlides().length;
      if (total > 1) {
        this.currentSlide.update(i => (i + 1) % total);
      }
    }, 5000);
  }

  prevSlide() {
    const total = this.carouselSlides().length;
    this.currentSlide.update(i => (i - 1 + total) % total);
  }

  nextSlide() {
    const total = this.carouselSlides().length;
    this.currentSlide.update(i => (i + 1) % total);
  }

  prevProject() {
    const total = this.projects().length;
    this.activeIndex.update(i => (i - 1 + total) % total);
  }

  nextProject() {
    const total = this.projects().length;
    this.activeIndex.update(i => (i + 1) % total);
  }
}
