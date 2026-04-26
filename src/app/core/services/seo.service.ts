import { Injectable, inject } from '@angular/core';
import { Meta, Title, MetaDefinition } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);

  updateTags(config: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    keywords?: string;
  }) {
    const siteName = 'RicardoMB.tech';
    const finalTitle = config.title ? `${config.title} | ${siteName}` : siteName;

    this.title.setTitle(finalTitle);

    const tags: MetaDefinition[] = [
      { name: 'description', content: config.description || 'Ingeniero de Sistemas enfocado en soluciones de Software e IoT.' },
      { name: 'keywords', content: config.keywords || 'Software, IoT, Angular, TypeScript, Ricardo Martinez Banda, Ingeniero de Sistemas' },
      // Open Graph
      { property: 'og:title', content: finalTitle },
      { property: 'og:description', content: config.description || 'Diseño y desarrollo soluciones de software y sistemas IoT que conectan negocio, datos y dispositivos.' },
      { property: 'og:image', content: config.image || 'assets/image/logos/rm.png' },
      { property: 'og:url', content: `https://ricardomb.tech${config.url || ''}` },
      { property: 'og:type', content: config.type || 'website' },
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: finalTitle },
      { name: 'twitter:description', content: config.description || 'Ingeniero de Sistemas enfocado en soluciones de Software e IoT.' },
      { name: 'twitter:image', content: config.image || 'assets/image/logos/rm.png' },
    ];

    tags.forEach((tag) => {
      this.meta.updateTag(tag);
    });

    this.updateCanonicalUrl(config.url);
  }

  private updateCanonicalUrl(url?: string) {
    const head = this.document.getElementsByTagName('head')[0];
    let element: HTMLLinkElement | null = this.document.querySelector(`link[rel='canonical']`) || null;
    if (element === null) {
      element = this.document.createElement('link') as HTMLLinkElement;
      element.setAttribute('rel', 'canonical');
      head.appendChild(element);
    }
    element.setAttribute('href', `https://ricardomb.tech${url || ''}`);
  }
}
