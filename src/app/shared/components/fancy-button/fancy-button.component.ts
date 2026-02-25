import { ChangeDetectionStrategy, Component, computed, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-fancy-button',
  imports: [NgTemplateOutlet, RouterLink],
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
        <span class="original flex items-center justify-center gap-2 w-full h-full">
          @if (iconTemplate()) {
            <ng-container *ngTemplateOutlet="iconTemplate()!"></ng-container>
          }
          {{ label() }}
        </span>
        <span class="letters flex items-center justify-center gap-[2px] w-full" aria-hidden="true">
          @if (iconTemplate()) {
            <span class="icon-letter mr-2"><ng-container *ngTemplateOutlet="iconTemplate()!"></ng-container></span>
          }
          @for (char of labelChars(); track $index) {
            <span>{{ char }}</span>
          }
        </span>
      </a>
    } @else if (routeLink(); as rLink) {
      <a
        class="btn-53"
        [class.btn-53--filled]="variant() === 'filled'"
        [class.btn-53--outline]="variant() === 'outline'"
        [routerLink]="rLink"
      >
        <span class="original flex items-center justify-center gap-2 w-full h-full">
          @if (iconTemplate()) {
            <ng-container *ngTemplateOutlet="iconTemplate()!"></ng-container>
          }
          {{ label() }}
        </span>
        <span class="letters flex items-center justify-center gap-[2px] w-full" aria-hidden="true">
          @if (iconTemplate()) {
            <span class="icon-letter mr-2"><ng-container *ngTemplateOutlet="iconTemplate()!"></ng-container></span>
          }
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
        <span class="original flex items-center justify-center gap-2 w-full h-full">
          @if (iconTemplate()) {
            <ng-container *ngTemplateOutlet="iconTemplate()!"></ng-container>
          }
          {{ label() }}
        </span>
        <span class="letters flex items-center justify-center gap-[2px] w-full" aria-hidden="true">
          @if (iconTemplate()) {
            <span class="icon-letter mr-2"><ng-container *ngTemplateOutlet="iconTemplate()!"></ng-container></span>
          }
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
    class: 'inline-block w-full md:w-auto',
  },
})
export class FancyButtonComponent {
  readonly label = input('BUTTON');
  readonly variant = input<'filled' | 'outline'>('outline');
  readonly href = input<string | null>(null);
  readonly routeLink = input<string | any[] | null>(null);
  readonly iconTemplate = input<TemplateRef<any>>();

  readonly labelChars = computed(() => this.label().split(''));
}
