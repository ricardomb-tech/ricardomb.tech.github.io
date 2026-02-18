import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { ABOUT_3D_GALLERY } from './about.3d-gallery.data';
import { NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FlipWordsComponent } from '../../shared/components/flip-words/flip-words.component';
import { ShimmerTextComponent } from '../../shared/components/shimmer-text/shimmer-text.component';
import { TypewriterTitleComponent } from '../../shared/components/typewriter-title/typewriter-title.component';
import { FancyButtonComponent } from '../../shared/components/fancy-button/fancy-button.component';
import { Layered3dGalleryComponent } from '../../shared/components/layered-3d-gallery/layered-3d-gallery.component';
import { BounceCardsComponent } from '../../shared/components/bounce-cards/bounce-cards.component';
import { IconCloudComponent } from "../../shared/components/icon-cloud/icon-cloud.component";
import { BubbleTechListComponent } from '../../shared/components/bubble-tech-list';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    HeaderComponent, NgOptimizedImage, ShimmerTextComponent, TypewriterTitleComponent, FancyButtonComponent, Layered3dGalleryComponent, BounceCardsComponent, IconCloudComponent, FlipWordsComponent, BubbleTechListComponent
  ]
})
export class About {
  about3dGallery = ABOUT_3D_GALLERY;

  readonly bounceImages = signal([
    {
      src: 'assets/image/foto5.png',
      alt: 'Formación y Pensamiento Crítico',
      description: 'Búsqueda constante de conocimiento y fundamentos sólidos'
    },
    {
      src: 'assets/image/foto6.png',
      alt: 'Análisis y Planificación',
      description: 'Capacidad de abstracción y resolución de problemas complejos'
    },
    {
      src: 'assets/image/foto7.png',
      alt: 'Trabajo Colaborativo',
      description: 'Desarrollo de software en entornos ágiles y trabajo en equipo'
    },
    {
      src: 'assets/image/foto8.png',
      alt: 'Marca Personal y Networking',
      description: 'Comunicación efectiva y presencia en comunidades digitales'
    },
    {
      src: 'assets/image/foto9.png',
      alt: 'Liderazgo y Visión',
      description: 'Enfoque en resultados y adaptabilidad al entorno profesional'
    }
  ]);

  readonly bounceTransforms = signal([
    'rotate(3deg) scale(1.04)',
    'rotate(0deg) scale(1.04)',
    'rotate(-3deg) scale(1.04)',
    'rotate(3deg) scale(1.04)',
    'rotate(-3deg) scale(1.04)'
  ]);

  readonly flipWords = signal([
    'Desarrollador Web',
    'Ingeniero de Software',
    'Full Stack Developer',
    'Tech Enthusiast'
  ]);


  readonly iconCloudIcons = signal([
    { name: 'Angular', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/angular.svg' },
    { name: 'Database', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/solid/database.svg' },
    { name: 'Docker', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/docker.svg' },
    { name: 'Git', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/git-alt.svg' },
    { name: 'Java', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/java.svg' },
    { name: 'JavaScript', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/js.svg' },
    { name: 'MongoDB', color: '#fff', svg: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mongodb.svg' },
    { name: 'Next.js', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/neos.svg' },
    { name: 'Node.js', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/node-js.svg' },
    { name: 'NPM', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/npm.svg' },
    { name: 'Spring Boot', color: '#fff', svg: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/springboot.svg' },
    { name: 'TypeScript', color: '#fff', svg: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/typescript.svg' }
  ]);
  get iconCloudImages(): string[] {
    return this.iconCloudIcons().map(icon => icon.svg);
  }
}
