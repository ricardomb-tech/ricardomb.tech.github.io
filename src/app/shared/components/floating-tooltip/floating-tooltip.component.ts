import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy, signal } from '@angular/core';
import { computePosition, shift, flip, offset } from '@floating-ui/dom';

@Component({
  selector: 'app-floating-tooltip',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #floating
      class="floating-tooltip"
      [style.position]="'fixed'"
      [style.pointerEvents]="'none'"
      [style.opacity]="isVisible() ? '1' : '0'"
      [style.transition]="'opacity 0.2s ease'"
    >
      {{ tooltipText() }}
    </div>
  `,
  styles: [`
    .floating-tooltip {
      z-index: 1000;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      pointer-events: none;
    }
  `]
})
export class FloatingTooltipComponent implements OnInit, OnDestroy {
  @ViewChild('floating') floatingEl!: ElementRef<HTMLDivElement>;

  isVisible = signal(false);
  tooltipText = signal('');

  ngOnInit(): void {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseover', this.handleMouseOver.bind(this));
    document.addEventListener('mouseout', this.handleMouseOut.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    document.removeEventListener('mouseover', this.handleMouseOver.bind(this));
    document.removeEventListener('mouseout', this.handleMouseOut.bind(this));
  }

  private handleMouseOver(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.tagName === 'IMG') {
      this.isVisible.set(true);
      const imgElement = target as HTMLImageElement;
      this.tooltipText.set(imgElement.alt || target.title || 'Imagen');
    }
  }

  private handleMouseOut(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.tagName === 'IMG') {
      this.isVisible.set(false);
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    if (!this.isVisible() || !this.floatingEl?.nativeElement) return;

    const { clientX, clientY } = event;

    const virtualEl = {
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        x: clientX,
        y: clientY,
        left: clientX,
        right: clientX,
        top: clientY,
        bottom: clientY
      })
    };

    computePosition(virtualEl, this.floatingEl.nativeElement, {
      placement: 'right-start',
      middleware: [offset(5), flip(), shift()]
    }).then(({ x, y }) => {
      Object.assign(this.floatingEl.nativeElement.style, {
        top: `${y}px`,
        left: `${x}px`
      });
    });
  }
}
