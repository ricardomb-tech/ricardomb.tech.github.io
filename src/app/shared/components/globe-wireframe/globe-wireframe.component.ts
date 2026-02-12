import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  input,
  signal,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import type { GeoPermissibleObjects } from 'd3';
import type { Topology } from 'topojson-specification';

interface GeoFeature {
  type: string;
  geometry: Record<string, unknown>;
  properties: Record<string, unknown>;
}

@Component({
  selector: 'app-globe-wireframe',
  template: `
    <div #containerRef class="relative w-full h-full">
      <svg
        #svgRef
        class="w-full h-full"
        (mousedown)="onMouseDown($event)"
        (mousemove)="onMouseMove($event)"
        (mouseup)="onMouseUp()"
        (mouseleave)="onMouseLeave()"
      ></svg>
    </div>
  `,
  styleUrl: './globe-wireframe.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobeWireframeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('svgRef') private svgRef?: ElementRef<SVGSVGElement>;
  @ViewChild('containerRef') private containerRef?: ElementRef<HTMLDivElement>;

  readonly variant = input<'wireframe' | 'wireframesolid' | 'solid'>('wireframe');
  readonly scale = input(1);
  readonly autoRotate = input(true);
  readonly autoRotateSpeed = input(0.5);
  readonly showGraticule = input(true);

  private readonly platformId = inject(PLATFORM_ID);

  private worldData: GeoFeature[] = [];
  private rotation = signal<[number, number]>([0, 0]);
  private isVisible = signal(false);
  private isDragging = false;
  private lastMouse: [number, number] = [0, 0];
  private animationFrameId: number | null = null;
  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;
  private dimensions = signal<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.setupResizeObserver();
    this.setupIntersectionObserver();
    this.loadWorldData();
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.resizeObserver && this.containerRef?.nativeElement) {
      this.resizeObserver.unobserve(this.containerRef.nativeElement);
    }

    if (this.intersectionObserver && this.containerRef?.nativeElement) {
      this.intersectionObserver.unobserve(this.containerRef.nativeElement);
    }
  }

  private setupResizeObserver(): void {
    if (!this.containerRef?.nativeElement) {
      return;
    }

    const element = this.containerRef.nativeElement;

    const updateDimensions = () => {
      const width = element.offsetWidth || 300;
      this.dimensions.set({ width, height: width });
      this.renderGlobe();
    };

    updateDimensions();

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => updateDimensions());
      this.resizeObserver.observe(element);
    }
  }

  private setupIntersectionObserver(): void {
    if (!this.containerRef?.nativeElement) {
      return;
    }

    const element = this.containerRef.nativeElement;

    this.intersectionObserver = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        this.isVisible.set(entry.isIntersecting);

        if (entry.isIntersecting) {
          this.startAutoRotate();
        } else {
          this.stopAutoRotate();
        }
      },
      { threshold: 0.1 },
    );

    this.intersectionObserver.observe(element);
  }

  private async loadWorldData(): Promise<void> {
    try {
      const response = await fetch(
        'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
      );
      const world = (await response.json()) as Topology;
      const countriesFeature = feature(world, world.objects['countries']) as {
        type: string;
        features?: GeoFeature[];
      };
      this.worldData = countriesFeature.features || [];
      this.renderGlobe();
      this.startAutoRotate();
    } catch (error) {
      console.error('Error loading world data:', error);
    }
  }

  private startAutoRotate(): void {
    if (!this.autoRotate() || !this.isVisible()) {
      return;
    }

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const rotate = () => {
      if (!this.autoRotate() || !this.isVisible() || this.isDragging) {
        this.animationFrameId = null;
        return;
      }

      const [lon, lat] = this.rotation();
      this.rotation.set([(lon + this.autoRotateSpeed()) % 360, lat]);
      this.renderGlobe();
      this.animationFrameId = requestAnimationFrame(rotate);
    };

    this.animationFrameId = requestAnimationFrame(rotate);
  }

  private stopAutoRotate(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private renderGlobe(): void {
    if (!this.svgRef?.nativeElement) {
      return;
    }

    if (this.worldData.length === 0) {
      return;
    }

    const svgElement = this.svgRef.nativeElement;
    const svg = d3.select(svgElement);
    svg.selectAll('*').remove();

    const { width, height } = this.dimensions();
    const finalWidth = width || 800;
    const finalHeight = height || 500;

    svg.attr('width', finalWidth).attr('height', finalHeight);

    const minSize = Math.min(finalWidth, finalHeight);
    const baseScale = (minSize / 2) * this.scale();

    const projection = d3
      .geoOrthographic()
      .scale(baseScale * 0.9)
      .translate([finalWidth / 2, finalHeight / 2])
      .rotate(this.rotation())
      .precision(0.1);

    const path = d3.geoPath().projection(projection);

    const variant = this.variant();

    let countryFill = 'none';
    let strokeWidth = 1;
    let opacity = 1;
    let showGraticule = this.showGraticule();

    if (variant === 'wireframe') {
      countryFill = 'none';
      strokeWidth = 1;
      opacity = 1;
      showGraticule = true;
    } else if (variant === 'wireframesolid') {
      countryFill = 'none';
      strokeWidth = 1;
      opacity = 1;
      showGraticule = false;
    } else if (variant === 'solid') {
      countryFill = 'currentColor';
      strokeWidth = 0.5;
      opacity = 0.3;
      showGraticule = false;
    }

    if (showGraticule) {
      try {
        const graticule = d3.geoGraticule();
        const graticulePath = path(graticule());
        if (graticulePath) {
          svg
            .append('path')
            .datum(graticule())
            .attr('d', graticulePath)
            .attr('fill', 'none')
            .attr('stroke', 'currentColor')
            .attr('stroke-width', 1)
            .attr('opacity', 0.2);
        }
      } catch (error) {
        console.error('Error creating graticule:', error);
      }
    }

    svg
      .selectAll('.country')
      .data(this.worldData)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', (d: GeoFeature) => {
        try {
          const pathString = path(d as unknown as GeoPermissibleObjects);
          if (!pathString || typeof pathString !== 'string') {
            return '';
          }
          if (pathString.includes('NaN') || pathString.includes('Infinity')) {
            return '';
          }
          return pathString;
        } catch {
          return '';
        }
      })
      .attr('fill', countryFill)
      .attr('stroke', 'currentColor')
      .attr('stroke-width', strokeWidth)
      .attr('opacity', opacity)
      .style('visibility', function (this: SVGPathElement) {
        const pathData = d3.select(this).attr('d');
        return pathData && pathData.length > 0 && !pathData.includes('NaN')
          ? 'visible'
          : 'hidden';
      });

    try {
      const sphereOutline = path({ type: 'Sphere' } as any);
      if (sphereOutline) {
        svg
          .append('path')
          .datum({ type: 'Sphere' })
          .attr('d', sphereOutline)
          .attr('fill', 'none')
          .attr('stroke', 'currentColor')
          .attr('stroke-width', variant === 'wireframe' ? 1 : 1.5)
          .attr('opacity', variant === 'wireframe' ? 1 : 0.8);
      }
    } catch (error) {
      console.error('Error creating sphere outline:', error);
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (!this.svgRef?.nativeElement) {
      return;
    }

    this.isDragging = true;
    const rect = this.svgRef.nativeElement.getBoundingClientRect();
    this.lastMouse = [event.clientX - rect.left, event.clientY - rect.top];
    this.stopAutoRotate();
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.svgRef?.nativeElement) {
      return;
    }

    const rect = this.svgRef.nativeElement.getBoundingClientRect();
    const currentMouse: [number, number] = [
      event.clientX - rect.left,
      event.clientY - rect.top,
    ];

    const dx = currentMouse[0] - this.lastMouse[0];
    const dy = currentMouse[1] - this.lastMouse[1];

    const [lon, lat] = this.rotation();

    const newLon = lon + dx * 0.5;
    const newLat = Math.max(-90, Math.min(90, lat - dy * 0.5));

    this.rotation.set([newLon, newLat]);
    this.lastMouse = currentMouse;
    this.renderGlobe();
  }

  onMouseUp(): void {
    this.isDragging = false;
    this.startAutoRotate();
  }

  onMouseLeave(): void {
    this.isDragging = false;
    this.startAutoRotate();
  }
}
