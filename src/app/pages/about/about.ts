import { Component } from '@angular/core';
import { ABOUT_3D_GALLERY } from './about.3d-gallery.data';
import { NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ShimmerTextComponent } from '../../shared/components/shimmer-text/shimmer-text.component';
import { TypewriterTitleComponent } from '../../shared/components/typewriter-title/typewriter-title.component';
import { FancyButtonComponent } from '../../shared/components/fancy-button/fancy-button.component';
import { Layered3dGalleryComponent } from '../../shared/components/layered-3d-gallery/layered-3d-gallery.component';

@Component({
  selector: 'app-about',
  imports: [HeaderComponent, NgOptimizedImage, ShimmerTextComponent, TypewriterTitleComponent, FancyButtonComponent, Layered3dGalleryComponent],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  about3dGallery = ABOUT_3D_GALLERY;
}
