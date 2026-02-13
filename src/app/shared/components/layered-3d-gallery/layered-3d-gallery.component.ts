// layered-3d-gallery.component.ts
import { Component, ChangeDetectionStrategy, input, signal, computed, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Layered3DImage {
  src: string;
  alt: string;
  description: string;
}

@Component({
  selector: 'app-layered-3d-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'tabindex': '0',
    '(mouseleave)': 'onMouseLeave()'
  },
  imports: [CommonModule],
  templateUrl: './layered-3d-gallery.component.html',
  styleUrls: ['./layered-3d-gallery.component.css']
})
export class Layered3dGalleryComponent {
  private readonly elementRef = inject(ElementRef);

  readonly images = input<Layered3DImage[]>([]);
  readonly perspective = input(2000);
  readonly spacing = input<number>(200);

  readonly activeIndex = signal<number | null>(null);

  readonly galleryTransform = computed(() => {
    return 'rotateX(-15deg) rotateY(55deg)';
  });

  readonly layerTransforms = computed(() => {
    const images = this.images();
    const active = this.activeIndex();
    const numImages = images.length;

    return images.map((_, i) => {
      const isActive = active === i;
      const zStart = -270;
      const zEnd = 270;
      const zRange = zEnd - zStart;
      const translateZ = numImages === 1 ? 0 : zStart + (i / (numImages - 1)) * zRange;

      // Unificar animación para todas
      const scale = active === null ? 1 : isActive ? 0.95 : 0.78;
      const opacity = active === null ? 1 : isActive ? 1 : 0.4;

      return {
        transform: `translateZ(${translateZ}px) scale(${scale})`,
        zIndex: isActive ? 9999 : 0,
        opacity
      };
    });
  });

  private getOpacity(i: number): number {
    const active = this.activeIndex();
    if (active === null) return 1;
    return active === i ? 1 : 0.4;
  }

  onMouseLeave(): void {
    this.activeIndex.set(null);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
