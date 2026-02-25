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
  repoUrl?: string;
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
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2070&auto=format&fit=crop',
      alt: 'ExcursionistasApp',
      title: 'ExcursionistasApp',
      description: 'Plataforma diseñada para organizar y gestionar paseos y excursiones de forma sencilla.',
      technologies: ['Mobile/Web', 'Geolocation', 'Social'],
      repoUrl: 'https://github.com/ricardomb-tech/ExcursionistasApp.git'
    },
    {
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop',
      alt: 'AppReciScan',
      title: 'AppReciScan',
      description: 'Aplicación innovadora para el escaneo automatizado de recibos usando IA.',
      technologies: ['OCR', 'AI', 'Mobile'],
      repoUrl: 'https://github.com/ricardomb-tech/AppReciScan.git'
    },
    {
      image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2070&auto=format&fit=crop',
      alt: 'Franchise API',
      title: 'Franchise API',
      description: 'Servicio Backend robusto destinado a la administración y logística de franquicias.',
      technologies: ['API REST', 'Node.js', 'Database'],
      repoUrl: 'https://github.com/ricardomb-tech/Franchise-API.git'
    },
    {
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
      alt: 'Project Fullstack Junior',
      title: 'Fullstack Junior',
      description: 'Proyecto que abarca el desarrollo de una arquitectura de software desde cero.',
      technologies: ['Fullstack', 'JavaScript', 'SQL'],
      repoUrl: 'https://github.com/ricardomb-tech/project-fullstack-junior.git'
    }
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

  getImageForProject(project: any): string | undefined {
    return project.image || 'assets/image/logos/default.svg';
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
