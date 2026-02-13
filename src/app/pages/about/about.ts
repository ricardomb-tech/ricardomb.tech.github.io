import { Component, signal } from '@angular/core';
import { ABOUT_3D_GALLERY } from './about.3d-gallery.data';
import { NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ShimmerTextComponent } from '../../shared/components/shimmer-text/shimmer-text.component';
import { TypewriterTitleComponent } from '../../shared/components/typewriter-title/typewriter-title.component';
import { FancyButtonComponent } from '../../shared/components/fancy-button/fancy-button.component';
import { Layered3dGalleryComponent } from '../../shared/components/layered-3d-gallery/layered-3d-gallery.component';
import { BounceCardsComponent } from '../../shared/components/bounce-cards/bounce-cards.component';


@Component({
  selector: 'app-about',
  imports: [HeaderComponent, NgOptimizedImage, ShimmerTextComponent, TypewriterTitleComponent, FancyButtonComponent, Layered3dGalleryComponent, BounceCardsComponent],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  about3dGallery = ABOUT_3D_GALLERY;


  readonly bounceImages = signal([
    {
      src: 'assets/image/foto5.png',
      alt: 'img1',
      description: 'Desarrollo de habilidades técnicas y blandas'
    },
    {
      src: 'assets/image/foto6.png',
      alt: 'img2',
      description: 'Colaboración en proyectos de código abierto'
    },
    {
      src: 'assets/image/foto7.png',
      alt: 'img3',
      description: 'Participación en comunidades tecnológicas'
    },
    {
      src: 'assets/image/foto8.png',
      alt: 'img4',
      description: 'Mentoría y apoyo a otros desarrolladores'
    },
    {
      src: 'assets/image/foto9.png',
      alt: 'img5',
      description: 'Innovación y aprendizaje continuo'
    }
  ]);

  readonly bounceTransforms = signal([
    'rotate(5deg) translate(-520px)',
    'rotate(0deg) translate(-260px)',
    'rotate(-5deg)',
    'rotate(5deg) translate(260px)',
    'rotate(-5deg) translate(520px)'
  ]);
}
