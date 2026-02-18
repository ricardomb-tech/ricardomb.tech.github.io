import { Component, input, signal, effect, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-flip-words',
  template: `
    <div class="flip-words z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-2" [class]="className()">
      @if (currentWord()) {
        @for (word of currentWord().split(' '); track $index) {
          <span class="inline-block whitespace-nowrap">
            @for (letter of word.split(''); track $index) {
              <span class="inline-block">{{ letter }}</span>
            }
            <span class="inline-block">&nbsp;</span>
          </span>
        }
      }
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // No animations: handled by CSS or left for future improvement
})
export class FlipWordsComponent {
  words = input<string[]>();
  duration = input(3000);
  className = input('');
  extraClasses = input<string>('');
  text = input<string>('');


  currentWord = signal('');
  private index = 0;

  constructor() {
    effect(() => {
      const w = this.words();
      if (w && w.length) {
        this.currentWord.set(w[0]);
        this.index = 0;
        this.startAnimation();
      }
    });
  }

  startAnimation() {
    setTimeout(() => {
      const w = this.words();
      if (!w || w.length === 0) return;
      this.index = (this.index + 1) % w.length;
      this.currentWord.set(w[this.index]);
      this.startAnimation();
    }, this.duration());
  }
}
