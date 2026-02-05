import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
    data: { animation: 'homePage' }
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then(m => m.About),
    data: { animation: 'aboutPage' }
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects').then(m => m.Projects),
    data: { animation: 'projectsPage' }
  },
  {
    path: 'experience',
    loadComponent: () => import('./pages/experience/experience').then(m => m.Experience),
    data: { animation: 'experiencePage' }
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
