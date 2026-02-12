import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

export interface CardFlipProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
}

@Component({
  selector: 'app-card-flip',
  templateUrl: './card-flip.component.html',
  styleUrl: './card-flip.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    class:
      'group relative h-[320px] w-full max-w-[280px] rounded-2xl [perspective:2000px]',
  },
})
export class CardFlipComponent {
  readonly title = input<string>('Design Systems');
  readonly subtitle = input<string>('Explore the fundamentals');
  readonly description = input<string>(
    'Dive deep into the world of modern UI/UX design.',
  );
  readonly features = input<string[]>([
    'UI/UX',
    'Modern Design',
    'Tailwind CSS',
    'Kokonut UI',
  ]);

  readonly isFlipped = signal(false);

  readonly circles = Array.from({ length: 10 });

  readonly cardTransform = computed(() =>
    this.isFlipped() ? 'rotateY(180deg)' : 'rotateY(0deg)',
  );

  readonly frontOpacity = computed(() => (this.isFlipped() ? 0 : 1));
  readonly backOpacity = computed(() => (this.isFlipped() ? 1 : 0));

  onMouseEnter(): void {
    this.isFlipped.set(true);
  }

  onMouseLeave(): void {
    this.isFlipped.set(false);
  }
}
