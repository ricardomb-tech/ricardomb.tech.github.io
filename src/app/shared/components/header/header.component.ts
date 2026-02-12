import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface NavigationItem {
  id: number;
  label: string;
  route: string;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly navigation = signal<NavigationItem[]>([
    { id: 1, label: 'Inicio', route: '/home' },
    { id: 2, label: 'Acerca de mi', route: '/about' },
    { id: 3, label: 'Proyectos', route: '/projects' },
    { id: 4, label: 'Experiencia', route: '/experience' },
  ]);
}
