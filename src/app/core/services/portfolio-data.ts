import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Experience, Project } from '../models/portfolio.models';

@Injectable({
  providedIn: 'root'
})
export class PortfolioData {
  private http = inject(HttpClient);

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('/assets/data/projects.json');
  }

  getExperience(): Observable<Experience[]> {
    return this.http.get<Experience[]>('/assets/data/experience.json');
  }
}
