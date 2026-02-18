// Distribución tipo dashboard bento
import { computed } from '@angular/core';

export function getBentoClass(index: number): string {
  // Ejemplo: 0 y 3 ocupan 2 filas, 1 y 2 ocupan 2 columnas, el resto normal
  switch (index) {
    case 0:
      return 'md:row-span-2 md:col-span-2';
    case 1:
      return 'md:col-span-2';
    case 2:
      return 'md:col-span-2';
    case 3:
      return 'md:row-span-2 md:col-span-2';
    case 4:
      return 'md:col-span-2';
    default:
      return '';
  }
}
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BentoCardComponent } from "../bento-card/bento-card.component";

@Component({
  selector: 'app-bento-grid',
  templateUrl: './bento-grid.component.html',
  styleUrls: ['./bento-grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BentoCardComponent]
})
export class BentoGridComponent {
getBentoClass(_t9: number): string|undefined {
throw new Error('Method not implemented.');
}
  @Input() features!: any[];
}
