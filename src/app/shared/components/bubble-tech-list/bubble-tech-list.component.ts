import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'app-bubble-tech-list',
  template: `
    <div class="bubble-container">
      <span
        *ngFor="let item of bubbleItems()"
        class="bubble-tech"
        [ngStyle]="item.baseStyle"
        (mouseenter)="onEnter($event, item.hoverColor, item.hoverText)"
        (mouseleave)="onLeave($event)"
      >
        {{ item.tech }}
      </span>
    </div>
  `,
  styles: [`
    .bubble-container {
      display: flex;
      flex-wrap: wrap;
      gap: 1.2rem 1.8rem;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding: 3rem 2rem;
    }

    .bubble-tech {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 1.1rem 2.6rem;
      border-radius: 999px;
      font-size: 1.25rem;
      font-family: 'DM Sans', 'Helvetica Neue', sans-serif;
      font-weight: 500;
      letter-spacing: -0.01em;
      background: #ffffff;
      color: #18181b;
      box-shadow: 0 4px 20px rgba(0,0,0,0.12);
      cursor: default;
      user-select: none;
      white-space: nowrap;
      opacity: 0;
      animation: bubbleIn 0.45s cubic-bezier(.34,1.56,.64,1) forwards;
      transition: background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
    }

    .bubble-tech:hover {
      box-shadow: 0 8px 32px rgba(0,0,0,0.22);
    }

    @keyframes bubbleIn {
      from { opacity: 0; scale: 0.65; translate: 0 16px; }
      to   { opacity: 1; scale: 1;    translate: 0 0;    }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgStyle]
})
export class BubbleTechListComponent {
  technologies = input<string[]>([]);

  bubbleItems = computed(() =>
    (this.technologies() ?? []).map((tech, i) => ({
      tech,
      hoverColor: this.getBgColor(tech),
      hoverText: this.getTextColor(tech),
      baseStyle: {
        transform: `rotate(${this.seededRotation(i).toFixed(1)}deg)`,
        animationDelay: `${(i * 0.07).toFixed(2)}s`,
      }
    }))
  );

  onEnter(event: MouseEvent, bgColor: string, textColor: string): void {
    const el = event.currentTarget as HTMLElement;
    el.style.background = bgColor;
    el.style.color = textColor;
    // Preservar la rotación original y añadir scale
    const currentTransform = el.style.transform;
    el.dataset['origTransform'] = currentTransform;
    el.style.transform = currentTransform + ' scale(1.06)';
  }

  onLeave(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    el.style.background = '#ffffff';
    el.style.color = '#18181b';
    el.style.transform = el.dataset['origTransform'] ?? '';
  }

  private seededRotation(index: number): number {
    const seed = (index * 2654435761) >>> 0;
    const normalized = (seed % 1000) / 1000;
    return -16 + normalized * 32;
  }

  private getBgColor(tech: string): string {
    const map: Record<string, string> = {
      'Angular': '#dd0031',
      'TypeScript': '#3178c6',
      'JavaScript (ES6+)': '#f7df1e',
      'HTML5 & CSS3': '#e44d26',
      'Tailwind CSS': '#38bdf8',
      'RxJS': '#b7178c',
      'Node.js': '#3c873a',
      'Firebase': '#ffcb2b',
      'Git & GitHub': '#24292f',
      'Figma': '#a259ff',
      'Jest': '#c63d14',
      'Docker': '#2496ed',
      'MongoDB': '#47a248',
      'PostgreSQL': '#336791',
      'Spring Boot': '#6db33f',
      'AWS': '#ff9900',
      'Terraform': '#7b42bc',
      'Kubernetes': '#326ce5',
    };
    return map[tech] ?? '#2a2a2a';
  }

  private getTextColor(tech: string): string {
    const lightBg = ['JavaScript (ES6+)', 'HTML5 & CSS3', 'Tailwind CSS', 'Firebase', 'AWS'];
    return lightBg.includes(tech) ? '#18181b' : '#ffffff';
  }
}
