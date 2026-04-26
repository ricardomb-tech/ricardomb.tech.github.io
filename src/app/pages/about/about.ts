import { Component, signal, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { ABOUT_3D_GALLERY } from './about.3d-gallery.data';
import { NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ShimmerTextComponent } from '../../shared/components/shimmer-text/shimmer-text.component';
import { TypewriterTitleComponent } from '../../shared/components/typewriter-title/typewriter-title.component';
import { FancyButtonComponent } from '../../shared/components/fancy-button/fancy-button.component';
import { Layered3dGalleryComponent } from '../../shared/components/layered-3d-gallery/layered-3d-gallery.component';
import { BounceCardsComponent } from '../../shared/components/bounce-cards/bounce-cards.component';
import { IconCloudComponent } from "../../shared/components/icon-cloud/icon-cloud.component";
import { BubbleTechListComponent } from '../../shared/components/bubble-tech-list';
import { InteractiveGlobeComponent } from '../../shared/components/interactive-globe/interactive-globe.component';
import { NgFor } from '@angular/common';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // standalone: true,
  imports: [
    HeaderComponent, NgOptimizedImage, ShimmerTextComponent, TypewriterTitleComponent, FancyButtonComponent, BounceCardsComponent, IconCloudComponent, BubbleTechListComponent, InteractiveGlobeComponent
  ]
})
export class About implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateTags({
      title: 'Acerca de mí',
      description: 'Conoce más sobre la trayectoria de Ricardo Martinez Banda como Ingeniero de Sistemas y su enfoque en soluciones tecnológicas.',
      url: '/about'
    });
  }

  about3dGallery = ABOUT_3D_GALLERY;

  features = [
    {
      icon: 'fa-regular fa-file-lines',
      name: 'Save your files',
      description: 'We automatically save your files as you type.',
      href: '/',
      cta: 'Learn more',
      background: 'bg-gradient-to-tr from-sky-800/30 to-transparent',
      className: 'md:row-span-2'
    },
    {
      icon: 'fa-solid fa-magnifying-glass',
      name: 'Full text search',
      description: 'Search through all your files in one place.',
      href: '/',
      cta: 'Learn more',
      background: 'bg-gradient-to-tr from-pink-800/30 to-transparent',
      className: 'md:col-span-2'
    },
    {
      icon: 'fa-solid fa-globe',
      name: 'Multilingual',
      description: 'Supports 100+ languages and counting.',
      href: '/',
      cta: 'Learn more',
      background: 'bg-gradient-to-tr from-green-800/30 to-transparent',
      className: 'md:col-span-2'
    },
    {
      icon: 'fa-regular fa-calendar',
      name: 'Calendar',
      description: 'Use the calendar to filter your files by date.',
      href: '/',
      cta: 'Learn more',
      background: 'bg-gradient-to-tr from-yellow-800/30 to-transparent',
      className: 'md:row-span-2'
    },
    {
      icon: 'fa-regular fa-bell',
      name: 'Notifications',
      description: 'Get notified when someone shares a file or mentions you in a comment.',
      href: '/',
      cta: 'Learn more',
      background: 'bg-gradient-to-tr from-purple-800/30 to-transparent',
      className: 'md:col-span-2'
    }
  ];

  readonly bounceImages = signal([
    {
      src: 'assets/image/foto5.png',
      alt: 'Desarrollo Full-Stack',
      description: 'Construcción de software de principio a fin'
    },
    {
      src: 'assets/image/foto6.png',
      alt: 'Análisis de Datos y Reportes',
      description: 'Toma de decisiones basadas en datos concisos'
    },
    {
      src: 'assets/image/foto7.png',
      alt: 'Gestión de Proyectos Ágiles',
      description: 'Entregas incrementales en equipos dinámicos'
    },
    {
      src: 'assets/image/foto8.png',
      alt: 'Resolución de Problemas',
      description: 'Creación de hotfixes críticos y análisis de bugs'
    },
    {
      src: 'assets/image/foto9.png',
      alt: 'Trabajo Colaborativo',
      description: 'Sinergia entre equipos para lograr objetivos'
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
    'Desarrollador Full-Stack',
    'Ingeniero Backend',
    'apoyado en IoT',
    'Solucionador de problemas'
  ]);


  readonly iconCloudIcons = signal([
    { name: 'Angular', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/angular.svg' },
    { name: 'Database', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/solid/database.svg' },
    { name: 'Docker', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/docker.svg' },
    { name: 'Git', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/git-alt.svg' },
    { name: 'Java', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/java.svg' },
    { name: 'JavaScript', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/js.svg' },
    { name: 'Laravel', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/laravel.svg' },
    { name: 'Node.js', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/node-js.svg' },
    { name: 'NPM', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/npm.svg' },
    { name: 'PHP', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/php.svg' },
    { name: 'AWS', color: '#fff', svg: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/svgs/brands/aws.svg' },
    { name: 'TypeScript', color: '#fff', svg: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/typescript.svg' }
  ]);
  get iconCloudImages(): string[] {
    return this.iconCloudIcons().map(icon => icon.svg);
  }
}
