import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-experience',
  imports: [HeaderComponent],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateTags({
      title: 'Experiencia',
      description: 'Trayectoria profesional y experiencia laboral de Ricardo Martinez Banda en el desarrollo de software y sistemas IoT.',
      url: '/experience'
    });
  }
}
