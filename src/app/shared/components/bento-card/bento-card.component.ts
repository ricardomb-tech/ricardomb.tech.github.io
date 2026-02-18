import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bento-card',
  templateUrl: './bento-card.component.html',
  styleUrls: ['./bento-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class BentoCardComponent {
  @Input() icon!: string;
  @Input() name!: string;
  @Input() description!: string;
  @Input() href?: string;
  @Input() cta?: string;
  @Input() background?: string;
  @Input() extraClass?: string;
}
