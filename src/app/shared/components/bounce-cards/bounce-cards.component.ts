import { Component, ChangeDetectionStrategy, input, signal, ElementRef, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

export interface BounceCardsImage {
  src: string;
  alt?: string;
  description?: string;
}

@Component({
  selector: 'app-bounce-cards',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'tabindex': '0',
    '(mouseleave)': 'resetSiblings()'
  },
  imports: [CommonModule],
  templateUrl: './bounce-cards.component.html',
  styleUrls: ['./bounce-cards.component.css']
})
export class BounceCardsComponent {
  private readonly elementRef = inject(ElementRef);

  readonly images = input<BounceCardsImage[]>([]);
  readonly containerWidth = input<number>(780);
  readonly containerHeight = input<number>(340);
  readonly animationDelay = input<number>(1.1);
  readonly animationStagger = input<number>(0.09);
  readonly easeType = input<string>('elastic.out(1, 0.5)');
  readonly transformStyles = input<string[]>([
    'rotate(5deg) translate(-420px)',
    'rotate(0deg) translate(-210px)',
    'rotate(-5deg)',
    'rotate(5deg) translate(210px)',
    'rotate(-5deg) translate(420px)'
  ]);
  readonly enableHover = input<boolean>(true);

  readonly hoveredIndex = signal<number | null>(null);
  readonly showTooltip = signal<boolean>(false);
  readonly tooltipPosition = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  constructor() {
    effect(() => {
      this.animateIn();
    });
  }

  onCardMouseEnter(event: MouseEvent, index: number) {
    this.hoveredIndex.set(index);
    this.showTooltip.set(true);
    this.updateTooltipPosition(event);
    this.pushSiblings(index);
  }

  onCardMouseMove(event: MouseEvent) {
    if (this.showTooltip()) {
      this.updateTooltipPosition(event);
    }
  }

  onCardMouseLeave() {
    this.resetSiblings();
  }

  private updateTooltipPosition(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement | null;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const padding = 12;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const clampedX = Math.max(padding, Math.min(x, rect.width - padding));
    const clampedY = Math.max(padding, Math.min(y, rect.height - padding));

    this.tooltipPosition.set({ x: clampedX, y: clampedY });
  }

  animateIn() {
    const el = this.elementRef.nativeElement;
    gsap.fromTo(
      el.querySelectorAll('.card'),
      { scale: 0 },
      {
        scale: 1,
        stagger: this.animationStagger(),
        ease: this.easeType(),
        delay: this.animationDelay()
      }
    );
  }

  getNoRotationTransform(transformStr: string): string {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    if (hasRotate) {
      return transformStr.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)');
    } else if (transformStr === 'none') {
      return 'rotate(0deg)';
    } else {
      return `${transformStr} rotate(0deg)`;
    }
  }

  getPushedTransform(baseTransform: string, offsetX: number): string {
    const translateRegex = /translate\(([-0-9.]+)px\)/;
    const match = baseTransform.match(translateRegex);
    if (match) {
      const currentX = parseFloat(match[1]);
      const newX = currentX + offsetX;
      return baseTransform.replace(translateRegex, `translate(${newX}px)`);
    } else {
      return baseTransform === 'none' ? `translate(${offsetX}px)` : `${baseTransform} translate(${offsetX}px)`;
    }
  }

  pushSiblings(hoveredIdx: number) {
    if (!this.enableHover()) return;
    const el = this.elementRef.nativeElement;
    this.images().forEach((_, i) => {
      const card = el.querySelector(`.card-${i}`);
      gsap.killTweensOf(card);
      const baseTransform = this.transformStyles()[i] || 'none';
      if (i === hoveredIdx) {
        const noRotation = this.getNoRotationTransform(baseTransform);
        gsap.to(card, {
          transform: `${noRotation} scale(1.08) translateY(-18px)`,
          zIndex: 10,
          opacity: 1,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          duration: 0.45,
          ease: 'back.out(1.7)',
          overwrite: 'auto'
        });
      } else {
        const offsetX = 0;
        const pushedTransform = this.getPushedTransform(baseTransform, offsetX);
        const distance = Math.abs(hoveredIdx - i);
        const delay = distance * 0.07;
        gsap.to(card, {
          transform: `${pushedTransform} scale(1)`,
          zIndex: 1,
          opacity: 0.2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          duration: 0.45,
          delay,
          ease: 'back.out(1.2)',
          overwrite: 'auto'
        });
      }
    });
  }

  resetSiblings() {
    if (!this.enableHover()) return;
    this.hoveredIndex.set(null);
    this.showTooltip.set(false);
    const el = this.elementRef.nativeElement;
    this.images().forEach((_, i) => {
      const card = el.querySelector(`.card-${i}`);
      gsap.killTweensOf(card);
      const baseTransform = this.transformStyles()[i] || 'none';
      gsap.to(card, {
        transform: baseTransform,
        zIndex: 1,
        opacity: 1,
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        duration: 0.4,
        ease: 'back.out(1.4)',
        overwrite: 'auto'
      });
    });
  }

  trackByIndex(index: number): number {
    return index;
  }
}
