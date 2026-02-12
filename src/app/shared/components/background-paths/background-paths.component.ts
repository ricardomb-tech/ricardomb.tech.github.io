import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

interface SvgOptions {
  duration?: number;
}

interface NodePoint {
  x: number;
  y: number;
}

@Component({
  selector: 'app-background-paths',
  templateUrl: './background-paths.component.html',
  styleUrl: './background-paths.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackgroundPathsComponent {
  readonly extraClasses = input<string>('');
  readonly svgOptions = input<SvgOptions | undefined>();

  private readonly baseClasses =
    'relative h-[24rem] md:h-screen w-full bg-black text-slate-100';

  readonly containerClasses = computed(() => {
    const extra = this.extraClasses();
    return extra ? `${this.baseClasses} ${extra}` : this.baseClasses;
  });

  readonly circuits: string[] = [
    'M 50 100 L 200 100 L 200 200 L 350 200 L 350 300 L 500 300',
    'M 500 50 L 500 150 L 650 150 L 650 250 L 800 250 L 800 350',
    'M 100 400 L 250 400 L 250 500 L 400 500 L 400 600 L 550 600',
    'M 600 400 L 750 400 L 750 500 L 900 500 L 900 600',
    'M 50 300 L 150 300 L 150 450 L 300 450 L 300 550',
    'M 700 100 L 850 100 L 850 200 L 950 200',
    'M 150 200 L 300 200 L 300 350 L 450 350 L 450 450',
    'M 550 150 L 700 150 L 700 300 L 850 300',
  ];

  readonly nodes: NodePoint[] = [
    { x: 200, y: 100 },
    { x: 350, y: 200 },
    { x: 500, y: 300 },
    { x: 500, y: 150 },
    { x: 650, y: 150 },
    { x: 800, y: 350 },
    { x: 250, y: 400 },
    { x: 400, y: 500 },
    { x: 750, y: 400 },
    { x: 150, y: 300 },
    { x: 300, y: 450 },
    { x: 850, y: 100 },
  ];

  durationForPath(index: number): string {
    const base = this.svgOptions()?.duration ?? 6;
    return `${base}s`;
  }

  delayForPath(index: number): string {
    return `${index * 0.5}s`;
  }

  delayForNode(index: number): string {
    return `${index * 0.3}s`;
  }
}
