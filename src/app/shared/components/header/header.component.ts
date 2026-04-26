import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavigationItem {
  id: number;
  label: string;
  route: string;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly navigation = signal<NavigationItem[]>([
    { id: 1, label: 'Inicio', route: '/home' },
    { id: 2, label: 'Acerca de mí', route: '/about' },
    { id: 3, label: 'Proyectos', route: '/projects' },
    { id: 4, label: 'Experiencia', route: '/experience' },
    { id: 5, label: 'Contacto', route: '/contact' },
  ]);

  readonly isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }
}
