import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  effect,
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

interface Marker {
  location: [number, number];
  size: number;
  label?: string;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface CityCoordinates {
  [key: string]: [number, number];
}

@Component({
  selector: 'app-interactive-globe',
  template: `
    <div
      #containerRef
      class="relative w-full h-full aspect-square"
      (wheel)="onWheel($event)"
    >
      <svg
        #svgRef
        class="w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-1000"
        (mousedown)="onMouseDown($event)"
        (mousemove)="onMouseMove($event)"
        (mouseup)="onMouseUp()"
        (mouseleave)="onMouseLeave()"
        (touchstart)="onTouchStart($event)"
        (touchmove)="onTouchMove($event)"
        (touchend)="onTouchEnd()"
      ></svg>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class InteractiveGlobeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('svgRef') private svgRef?: ElementRef<SVGSVGElement>;
  @ViewChild('containerRef') private containerRef?: ElementRef<HTMLDivElement>;

  // Inputs personalizables
  readonly baseColor = input<[number, number, number]>([0.3, 0.3, 0.3]);
  readonly markerColor = input<[number, number, number]>([0.1, 0.8, 1]);
  readonly glowColor = input<[number, number, number]>([1, 1, 1]);
  readonly markers = input<Marker[]>([]);
  readonly scale = input(1);
  readonly rotateToLocation = input<string | [number, number] | null>(null);
  readonly autoRotate = input(true);
  readonly rotateCities = input<string[]>([]);
  readonly rotationSpeed = input(3000);

  private readonly platformId = inject(PLATFORM_ID);

  private worldData: GeoFeature[] = [];
  private currentPhi = signal(0);
  private currentTheta = signal(0);
  private pointerInteracting = signal<number | null>(null);
  private pointerInteractionMovement = signal(0);
  private isVisible = signal(false);
  private animationFrameId: number | null = null;
  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;
  private rotationTimeoutId: number | null = null;
  private currentCityIndex = signal(0);
  private touchStart = signal<[number, number] | null>(null);
  private dimensions = signal<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  private focusLocation = signal<[number, number] | null>(null);

  private readonly doublePi = Math.PI * 2;

  private cityCoordinates: CityCoordinates = {
    'san francisco': [37.7749, -122.4194],
    'new york': [40.7128, -74.006],
    london: [51.5074, -0.1278],
    tokyo: [35.6762, 139.6503],
    paris: [48.8566, 2.3522],
    moscow: [55.7558, 37.6176],
    dubai: [25.2048, 55.2708],
    singapore: [1.3521, 103.8198],
  };

  constructor() {
    // Effect para manejar rotateToLocation
    effect(() => {
      const location = this.rotateToLocation();
      if (location) {
        let coords: [number, number];
        if (typeof location === 'string') {
          const city = location.toLowerCase();
          coords = this.cityCoordinates[city] || [0, 0];
        } else {
          coords = location;
        }
        this.focusLocation.set(this.locationToAngles(...coords));
      } else {
        this.focusLocation.set(null);
      }
    });
  }

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

    if (this.rotationTimeoutId !== null) {
      clearTimeout(this.rotationTimeoutId);
    }

    if (this.resizeObserver && this.containerRef?.nativeElement) {
      this.resizeObserver.unobserve(this.containerRef.nativeElement);
    }

    if (this.intersectionObserver && this.containerRef?.nativeElement) {
      this.intersectionObserver.unobserve(this.containerRef.nativeElement);
    }
  }

  private locationToAngles(lat: number, long: number): [number, number] {
    return [
      Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
      (lat * Math.PI) / 180,
    ];
  }

  private rgbToHex(rgb: [number, number, number]): string {
    const [r, g, b] = rgb;
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
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
          if (this.rotateCities().length > 0) {
            this.startCityRotation();
          } else {
            this.startAutoRotate();
          }
        } else {
          this.stopAutoRotate();
          if (this.rotationTimeoutId !== null) {
            clearTimeout(this.rotationTimeoutId);
          }
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
      if (this.rotateCities().length > 0) {
        this.startCityRotation();
      } else if (this.autoRotate()) {
        this.startAutoRotate();
      }
    } catch (error) {
      console.error('Error loading world data:', error);
    }
  }

  private startCityRotation(): void {
    if (this.rotateCities().length === 0 || !this.isVisible()) {
      return;
    }

    const rotateToNextCity = () => {
      const cities = this.rotateCities();
      const nextIndex = (this.currentCityIndex() + 1) % cities.length;
      const city = cities[nextIndex].toLowerCase();
      const coordinates = this.cityCoordinates[city];

      if (coordinates) {
        this.focusLocation.set(this.locationToAngles(...coordinates));
        this.currentCityIndex.set(nextIndex);
      }

      if (this.isVisible()) {
        this.rotationTimeoutId = window.setTimeout(
          rotateToNextCity,
          this.rotationSpeed(),
        );
      }
    };

    const firstCity = this.rotateCities()[0].toLowerCase();
    const coordinates = this.cityCoordinates[firstCity];
    if (coordinates) {
      this.focusLocation.set(this.locationToAngles(...coordinates));
    }

    this.rotationTimeoutId = window.setTimeout(
      rotateToNextCity,
      this.rotationSpeed(),
    );
  }

  private startAutoRotate(): void {
    if (!this.autoRotate() || !this.isVisible()) {
      return;
    }

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const rotate = () => {
      if (!this.autoRotate() || !this.isVisible() || this.pointerInteracting() !== null) {
        return;
      }

      const currentPhi = this.currentPhi();
      this.currentPhi.set(currentPhi + 0.01);
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
    const svg = d3.select(svgElement) as unknown as d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
    svg.selectAll('*').remove();

    const { width, height } = this.dimensions();
    const finalWidth = width || 300;
    const finalHeight = height || 300;

    svg.attr('width', finalWidth).attr('height', finalHeight);

    const minSize = Math.min(finalWidth, finalHeight);
    const baseScale = (minSize / 2) * this.scale() * 0.9;

    // Actualizar phi y theta
    let currentPhi = this.currentPhi();
    let currentTheta = this.currentTheta();

    if (this.focusLocation()) {
      const [focusPhi, focusTheta] = this.focusLocation()!;
      const distPositive = (focusPhi - currentPhi + this.doublePi) % this.doublePi;
      const distNegative = (currentPhi - focusPhi + this.doublePi) % this.doublePi;

      currentPhi +=
        distPositive < distNegative
          ? distPositive * 0.08
          : -distNegative * 0.08;
      currentTheta = currentTheta * 0.92 + focusTheta * 0.08;
    }

    currentPhi += this.pointerInteractionMovement();

    const projection = d3
      .geoOrthographic()
      .scale(baseScale)
      .translate([finalWidth / 2, finalHeight / 2])
      .rotate([(-currentPhi * 180) / Math.PI, (-currentTheta * 180) / Math.PI])
      .precision(0.1);

    const path = d3.geoPath().projection(projection);

    // Graticule
    try {
      const graticule = d3.geoGraticule();
      const graticulePath = path(graticule());
      if (graticulePath) {
        svg
          .append('path')
          .datum(graticule())
          .attr('d', graticulePath)
          .attr('fill', 'none')
          .attr('stroke', this.rgbToHex(this.baseColor()))
          .attr('stroke-width', 1)
          .attr('opacity', 0.2);
      }
    } catch (error) {
      console.error('Error creating graticule:', error);
    }

    // Países
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
      .attr('fill', 'none')
      .attr('stroke', this.rgbToHex(this.baseColor()))
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.8)
      .style('visibility', function (this: SVGPathElement) {
        const pathData = d3.select(this).attr('d');
        return pathData && pathData.length > 0 && !pathData.includes('NaN')
          ? 'visible'
          : 'hidden';
      });

    // Esfera exterior
    try {
      const sphereOutline = path({ type: 'Sphere' } as any);
      if (sphereOutline) {
        svg
          .append('path')
          .datum({ type: 'Sphere' })
          .attr('d', sphereOutline)
          .attr('fill', 'none')
          .attr('stroke', this.rgbToHex(this.baseColor()))
          .attr('stroke-width', 1.5)
          .attr('opacity', 1);
      }
    } catch (error) {
      console.error('Error creating sphere outline:', error);
    }

    // Markers
    this.renderMarkers(svg, projection, path);

    this.currentPhi.set(currentPhi);
    this.currentTheta.set(currentTheta);
  }

  private renderMarkers(
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
    projection: d3.GeoProjection,
    path: d3.GeoPath,
  ): void {
    const markers = this.markers();
    if (!markers || markers.length === 0) {
      return;
    }

    const markerGroup = svg.append('g').attr('class', 'markers');

    markers.forEach(marker => {
      const [lat, lng] = marker.location;
      const projected = projection([lng, lat]);

      if (projected && Array.isArray(projected)) {
        const markerSize = marker.size || 0.05;

        // Glow effect
        markerGroup
          .append('circle')
          .attr('cx', projected[0])
          .attr('cy', projected[1])
          .attr('r', markerSize * 100)
          .attr('fill', this.rgbToHex(this.glowColor()))
          .attr('opacity', 0.1)
          .attr('class', 'marker-glow');

        // Marker principal
        markerGroup
          .append('circle')
          .attr('cx', projected[0])
          .attr('cy', projected[1])
          .attr('r', markerSize * 40)
          .attr('fill', this.rgbToHex(this.markerColor()))
          .attr('opacity', 0.9)
          .attr('class', 'marker')
          .style('cursor', 'pointer')
          .on('mouseover', function () {
            d3.select(this).attr('opacity', 1).attr('r', markerSize * 50);
          })
          .on('mouseout', function () {
            d3.select(this).attr('opacity', 0.9).attr('r', markerSize * 40);
          });

        // Label opcional
        if (marker.label) {
          markerGroup
            .append('text')
            .attr('x', projected[0])
            .attr('y', projected[1] - markerSize * 60)
            .attr('text-anchor', 'middle')
            .attr('fill', this.rgbToHex(this.baseColor()))
            .attr('font-size', '12px')
            .attr('font-weight', '500')
            .attr('class', 'marker-label')
            .text(marker.label);
        }
      }
    });
  }

  onMouseDown(event: MouseEvent): void {
    if (!this.svgRef?.nativeElement) {
      return;
    }

    this.pointerInteracting.set(event.clientX);
    this.stopAutoRotate();
  }

  onMouseMove(event: MouseEvent): void {
    if (this.pointerInteracting() === null) {
      return;
    }

    const delta = event.clientX - this.pointerInteracting()!;
    this.pointerInteractionMovement.set(delta / 200);
    this.renderGlobe();
  }

  onMouseUp(): void {
    this.pointerInteracting.set(null);
    this.pointerInteractionMovement.set(0);
    if (this.rotateCities().length > 0) {
      this.startCityRotation();
    } else if (this.autoRotate()) {
      this.startAutoRotate();
    }
  }

  onMouseLeave(): void {
    this.pointerInteracting.set(null);
    this.pointerInteractionMovement.set(0);
  }

  onTouchStart(event: TouchEvent): void {
    if (event.touches[0]) {
      this.touchStart.set([event.touches[0].clientX, event.touches[0].clientY]);
      this.pointerInteracting.set(event.touches[0].clientX);
      this.stopAutoRotate();
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (this.pointerInteracting() === null || !event.touches[0]) {
      return;
    }

    const delta = event.touches[0].clientX - this.pointerInteracting()!;
    this.pointerInteractionMovement.set(delta / 100);
    this.renderGlobe();
  }

  onTouchEnd(): void {
    this.pointerInteracting.set(null);
    this.pointerInteractionMovement.set(0);
    this.touchStart.set(null);
    if (this.rotateCities().length > 0) {
      this.startCityRotation();
    } else if (this.autoRotate()) {
      this.startAutoRotate();
    }
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    const currentScale = this.scale();
    const newScale = Math.max(0.5, Math.min(3, currentScale * delta));
    // Implementar cambio de escala si es necesario
  }
}
