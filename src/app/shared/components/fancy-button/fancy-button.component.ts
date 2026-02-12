import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-fancy-button',
  template: `
    @if (href(); as url) {
      <a
        class="btn-53"
        [class.btn-53--filled]="variant() === 'filled'"
        [class.btn-53--outline]="variant() === 'outline'"
        [href]="url"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="original">{{ label() }}</span>
        <span class="letters" aria-hidden="true">
          @for (char of labelChars(); track $index) {
            <span>{{ char }}</span>
          }
        </span>
      </a>
    } @else {
      <button
        type="button"
        class="btn-53"
        [class.btn-53--filled]="variant() === 'filled'"
        [class.btn-53--outline]="variant() === 'outline'"
      >
        <span class="original">{{ label() }}</span>
        <span class="letters" aria-hidden="true">
          @for (char of labelChars(); track $index) {
            <span>{{ char }}</span>
          }
        </span>
      </button>
    }
  `,
  styleUrl: './fancy-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class FancyButtonComponent {
  readonly label = input('BUTTON');
  readonly variant = input<'filled' | 'outline'>('outline');
  readonly href = input<string | null>(null);

  readonly labelChars = computed(() => this.label().split(''));
}
