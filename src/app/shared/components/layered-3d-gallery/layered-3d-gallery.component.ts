import { Component, ChangeDetectionStrategy, input, signal, computed, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  readonly perspective = input(5000);
    spacing = input<number>(200);


  readonly activeIndex = signal<number | null>(null);
  readonly mouseX = signal(0.5);
  readonly mouseY = signal(0.5);
  readonly isMouseMoving = signal(false);
  private mouseMoveTimeout?: number;

  constructor() {
    fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousemove')
      .pipe(
        throttleTime(16, undefined, { leading: true, trailing: true }),
        takeUntilDestroyed()
      )
      .subscribe((event: MouseEvent) => this.onMouseMove(event));
  }

  readonly galleryTransform = computed(() => {
    if (!this.isMouseMoving()) {
      return 'rotateX(-30deg) rotateY(40deg)'; // Posición fija cuando no hay movimiento
    }

    const mouseX = this.mouseX();
    const mouseY = this.mouseY();
    const rotateY = (mouseX - 0.5) * 40;
    const rotateX = -(mouseY - 0.5) * 30;
    return `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  readonly layerTransforms = computed(() => {
    const images = this.images();
    const active = this.activeIndex();
    const numImages = images.length;

    return images.map((_, i) => {
      const isActive = active === i;

      // Mayor separación entre capas: de -300px a +300px
      const zStart = -300;
      const zEnd = 300;
      const zRange = zEnd - zStart;
      const translateZ = zStart + (i / (numImages - 1)) * zRange;

      return {
        transform: `translateZ(${translateZ}px) ${isActive ? 'scale(1.05)' : 'scale(0.75)'}`,
        zIndex: i,
        opacity: this.getOpacity(i)
      };
    });
  });

  private getOpacity(i: number): number {
    const active = this.activeIndex();

    // Si hay una imagen activa, solo esa se ve
    if (active !== null) {
      return active === i ? 1 : 0.15;
    }

    // Si no hay activa, todas se ven con opacidad reducida
    return 0.85;
  }

  private onMouseMove(event: MouseEvent): void {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    this.mouseX.set((event.clientX - rect.left) / rect.width);
    this.mouseY.set((event.clientY - rect.top) / rect.height);

    // Marcar que el mouse se está moviendo
    this.isMouseMoving.set(true);

    // Resetear el timeout
    if (this.mouseMoveTimeout) {
      window.clearTimeout(this.mouseMoveTimeout);
    }

    // Después de 150ms sin movimiento, volver a la posición fija
    this.mouseMoveTimeout = window.setTimeout(() => {
      this.isMouseMoving.set(false);
    }, 150);
  }

  onMouseLeave(): void {
    this.activeIndex.set(null);
    this.mouseX.set(0.5);
    this.mouseY.set(0.5);
    this.isMouseMoving.set(false);
    if (this.mouseMoveTimeout) {
      window.clearTimeout(this.mouseMoveTimeout);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
