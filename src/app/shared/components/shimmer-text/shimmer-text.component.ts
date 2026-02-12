import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-shimmer-text',
  template: `
    <div class="relative inline-block overflow-hidden">
      <h1
        class="shimmer-text"
        [class]="textClasses()"
      >
        {{ text() }}
      </h1>
    </div>
  `,
  styleUrl: './shimmer-text.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex items-center leading-none',
  },
})
export class ShimmerTextComponent {
  readonly text = input<string>('Text Shimmer');
  readonly extraClasses = input<string>('');

  readonly textClasses = computed(() => {
    const base =
      'bg-[length:200%_100%] bg-gradient-to-r from-neutral-950 via-neutral-400 to-neutral-950 bg-clip-text font-bold text-transparent dark:from-white dark:via-neutral-600 dark:to-white tracking-tight leading-none';
    const extra = this.extraClasses();
    return extra ? `${base} ${extra}` : base;
  });
}
