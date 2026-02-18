import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  NgZone,
  OnDestroy
} from '@angular/core';

interface Icon {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  id: number;
}

@Component({
  selector: 'app-icon-cloud',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <canvas
      #canvas
      width="500"
      height="500"
      class="rounded-lg"
      style="background:transparent;display:block;"
      aria-label="Interactive 3D Icon Cloud"
      role="img"
      (mousedown)="onMouseDown($event)"
      (mousemove)="onMouseMove($event)"
      (mouseup)="onMouseUp()"
      (mouseleave)="onMouseUp()"
    ></canvas>
  `
})
export class IconCloudComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() images: string[] = [];
  @Input() iconSize = 64; // Valor por defecto, puedes aumentarlo

  private iconPositions: Icon[] = [];
  private iconCanvases: HTMLCanvasElement[] = [];
  private imagesLoaded: boolean[] = [];
  private animationFrameId = 0;
  private isDragging = false;
  private lastMousePos = { x: 0, y: 0 };
  private mousePos = { x: 200, y: 200 };
  private rotation = { x: 0, y: 0 };

  constructor(private ngZone: NgZone) { }

  ngAfterViewInit() {
    this.generateIcons();
    this.loadImages();
    this.ngZone.runOutsideAngular(() => this.animate());
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationFrameId);
  }

  private generateIcons() {
    const numIcons = this.images.length;
    const offset = 2 / numIcons;
    const increment = Math.PI * (3 - Math.sqrt(5));
    this.iconPositions = [];
    for (let i = 0; i < numIcons; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;
      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;
      this.iconPositions.push({
        x: x * 150,
        y: y * 150,
        z: z * 150,
        scale: 1,
        opacity: 1,
        id: i
      });
    }
  }

  private loadImages() {
    this.iconCanvases = [];
    this.imagesLoaded = new Array(this.images.length).fill(false);
    this.images.forEach((src, idx) => {
      const offscreen = document.createElement('canvas');
      offscreen.width = this.iconSize;
      offscreen.height = this.iconSize;
      const ctx = offscreen.getContext('2d');
      if (ctx) {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = src;
        img.onload = () => {
          ctx.clearRect(0, 0, this.iconSize, this.iconSize);
          ctx.save();
          ctx.beginPath();
          ctx.arc(this.iconSize / 2, this.iconSize / 2, this.iconSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, 0, 0, this.iconSize, this.iconSize);
          // Forzar a blanco: usar modo 'source-in' para colorear el icono
          ctx.globalCompositeOperation = 'source-in';
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, this.iconSize, this.iconSize);
          ctx.globalCompositeOperation = 'source-over';
          ctx.restore();
          this.imagesLoaded[idx] = true;
        };
      }
      this.iconCanvases.push(offscreen);
    });
  }

  onMouseDown(e: MouseEvent) {
    this.isDragging = true;
    this.lastMousePos = { x: e.clientX, y: e.clientY };
  }

  onMouseMove(e: MouseEvent) {
    if (this.isDragging) {
      const deltaX = e.clientX - this.lastMousePos.x;
      const deltaY = e.clientY - this.lastMousePos.y;
      this.rotation.x += deltaY * 0.002;
      this.rotation.y += deltaX * 0.002;
      this.lastMousePos = { x: e.clientX, y: e.clientY };
    }
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  onMouseUp() {
    this.isDragging = false;
  }

  private animate = () => {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const dx = this.mousePos.x - centerX;
    const dy = this.mousePos.y - centerY;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = 0.003 + (distance / maxDistance) * 0.01;

    if (!this.isDragging) {
      this.rotation.x += (dy / canvas.height) * speed;
      this.rotation.y += (dx / canvas.width) * speed;
    }

    this.iconPositions.forEach((icon, idx) => {
      const cosX = Math.cos(this.rotation.x);
      const sinX = Math.sin(this.rotation.x);
      const cosY = Math.cos(this.rotation.y);
      const sinY = Math.sin(this.rotation.y);

      const rotatedX = icon.x * cosY - icon.z * sinY;
      const rotatedZ = icon.x * sinY + icon.z * cosY;
      const rotatedY = icon.y * cosX + rotatedZ * sinX;

      const scale = (rotatedZ + 300) / 450;
      const opacity = Math.max(0.2, Math.min(1, (rotatedZ + 200) / 300));

      ctx.save();
      ctx.translate(centerX + rotatedX, centerY + rotatedY);
      ctx.scale(scale, scale);
      ctx.globalAlpha = opacity;

      if (this.iconCanvases[idx] && this.imagesLoaded[idx]) {
        const half = this.iconSize / 2;
        ctx.drawImage(this.iconCanvases[idx], -half, -half, this.iconSize, this.iconSize);
      }
      ctx.restore();
    });

    this.animationFrameId = requestAnimationFrame(this.animate);
  };
}
