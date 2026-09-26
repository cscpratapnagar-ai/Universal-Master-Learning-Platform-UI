import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LearningService } from '../../../../core/services/learning.service';
import { OrganizationProjectEnrollment } from '../../../../core/models/organization.model';

@Component({
  selector: 'app-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss']
})
export class MyProjectsComponent implements OnInit {
  projects: OrganizationProjectEnrollment[] = [];
  loading = true;
  error = '';

  constructor(private readonly learning: LearningService, private readonly router: Router) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.learning.myProjects().subscribe({
      next: r => { this.projects = r.data || []; this.loading = false; },
      error: e => { this.projects = []; this.error = e?.error?.message || 'Unable to load your projects.'; this.loading = false; }
    });
  }

  openProject(project: OrganizationProjectEnrollment): void {
    this.router.navigate(['/learner/projects', project.programId]);
  }

  trackById(_: number, item: OrganizationProjectEnrollment): string { return item.id; }
}
