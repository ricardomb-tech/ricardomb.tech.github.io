import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  input,
  signal,
} from '@angular/core';

type TypewriterSequence = {
  text: string;
  deleteAfter?: boolean;
  pauseAfter?: number;
};

@Component({
  selector: 'app-typewriter-title',
  template: `
    <div class="typewriter-wrapper">
      <span class="typewriter-text">{{ displayText() }}</span>
      <span class="typewriter-cursor"></span>
    </div>
  `,
  styleUrl: './typewriter-title.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'inline-flex items-center gap-2 text-3xl md:text-4xl lg:text-5xl font-mono font-light tracking-tight text-slate-100 flex-shrink-0 leading-none align-middle',
  },
})
export class TypewriterTitleComponent implements OnDestroy {
  readonly sequences = input<TypewriterSequence[]>([
    { text: 'backend', deleteAfter: true },
    { text: 'Escalable', deleteAfter: true },
    { text: 'basado en datos', deleteAfter: false },

  ]);

  readonly typingSpeed = input(50);
  readonly startDelay = input(200);
  readonly autoLoop = input(true);
  readonly loopDelay = input(1000);
  readonly deleteSpeed = input(30);
  readonly pauseBeforeDelete = input(1000);
  readonly naturalVariance = input(true);

  readonly displayText = signal('');

  private sequenceIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private timeoutId: number | null = null;

  constructor() {
    this.startTypewriter();
  }

  ngOnDestroy(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }
  }

  private startTypewriter(): void {
    const delay = this.startDelay();
    this.timeoutId = window.setTimeout(() => this.runTypewriter(), delay);
  }

  private getTypingDelay(): number {
    const typingSpeed = this.typingSpeed();
    if (!this.naturalVariance()) {
      return typingSpeed;
    }

    const random = Math.random();
    if (random < 0.1) {
      return typingSpeed * 2;
    }
    if (random > 0.9) {
      return typingSpeed * 0.5;
    }

    const variance = 0.4;
    const min = typingSpeed * (1 - variance);
    const max = typingSpeed * (1 + variance);
    return Math.random() * (max - min) + min;
  }

  private schedule(next: () => void, delay: number): void {
    this.timeoutId = window.setTimeout(next, delay);
  }

  private runTypewriter(): void {
    const sequences = this.sequences();
    const current = sequences[this.sequenceIndex];
    if (!current) {
      return;
    }

    const autoLoop = this.autoLoop();
    const loopDelay = this.loopDelay();
    const deleteSpeed = this.deleteSpeed();
    const pauseBeforeDelete = this.pauseBeforeDelete();

    if (this.isDeleting) {
      if (this.charIndex > 0) {
        this.charIndex -= 1;
        this.displayText.set(current.text.slice(0, this.charIndex));
        this.schedule(() => this.runTypewriter(), deleteSpeed);
      } else {
        this.isDeleting = false;
        const isLast = this.sequenceIndex === sequences.length - 1;

        if (isLast && autoLoop) {
          this.schedule(() => {
            this.sequenceIndex = 0;
            this.runTypewriter();
          }, loopDelay);
        } else if (!isLast) {
          this.schedule(() => {
            this.sequenceIndex += 1;
            this.runTypewriter();
          }, 100);
        }
      }
      return;
    }

    if (this.charIndex < current.text.length) {
      this.charIndex += 1;
      this.displayText.set(current.text.slice(0, this.charIndex));
      this.schedule(() => this.runTypewriter(), this.getTypingDelay());
      return;
    }

    const pauseDuration = current.pauseAfter ?? pauseBeforeDelete;

    if (current.deleteAfter) {
      this.schedule(() => {
        this.isDeleting = true;
        this.runTypewriter();
      }, pauseDuration);
      return;
    }

    const isLast = this.sequenceIndex === sequences.length - 1;
    if (isLast && autoLoop) {
      this.schedule(() => {
        this.sequenceIndex = 0;
        this.charIndex = 0;
        this.displayText.set('');
        this.runTypewriter();
      }, loopDelay);
    } else if (!isLast) {
      this.schedule(() => {
        this.sequenceIndex += 1;
        this.charIndex = 0;
        this.displayText.set('');
        this.runTypewriter();
      }, pauseDuration);
    }
  }
}
