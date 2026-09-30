import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { AcademyService } from '../../../../core/services/academy.service';
import { AcademyOverview } from '../../../../core/models/academy.model';

interface AcademyArea {
  title: string;
  description: string;
  icon: string;
  route: string;
  tone: string;
}

@Component({
  selector: 'app-academy-dashboard',
  templateUrl: './academy-dashboard.component.html',
  styleUrls: ['./academy-dashboard.component.scss']
})
export class AcademyDashboardComponent {
  readonly areas: AcademyArea[] = [
    { title: 'Courses', description: 'Catalog visibility, lifecycle metrics and course operations.', icon: '▣', route: '/academy/courses', tone: 'blue' },
    { title: 'Teachers', description: 'Teacher workforce visibility and teaching operations.', icon: '✦', route: '/academy/teachers', tone: 'purple' },
    { title: 'Learners', description: 'Learner workforce visibility and experience operations.', icon: '◉', route: '/academy/learners', tone: 'cyan' },
    { title: 'Assessments', description: 'Assessment inventory, rules and exam operations.', icon: '✓', route: '/academy/assessments', tone: 'orange' },
    { title: 'Question Bank', description: 'Central question inventory and authoring operations.', icon: '▤', route: '/academy/question-bank', tone: 'green' },
    { title: 'Programs', description: 'Track program lifecycle from draft to completion.', icon: '◈', route: '/academy/programs', tone: 'violet' },
    { title: 'Exam Portal', description: 'Launch the secure examination experience.', icon: '▥', route: '/exam-portal', tone: 'pink' },
    { title: 'AI Teacher', description: 'Give learners intelligent teaching support inside courses.', icon: 'AI', route: '/learner', tone: 'gold' },
    { title: 'Organization', description: 'Open the organization governance workspace when assigned.', icon: '▦', route: '/organization', tone: 'navy' }
  ];

  overview: AcademyOverview | null = null;
  overviewLoading = true;
  overviewError = false;

  constructor(
    private readonly router: Router,
    private readonly auth: AuthService,
    private readonly academy: AcademyService
  ) {
    this.loadOverview();
  }

  loadOverview(): void {
    this.overviewLoading = true;
    this.overviewError = false;
    this.academy.overview().subscribe({
      next: response => {
        this.overview = response.data;
        this.overviewLoading = false;
      },
      error: () => {
        this.overviewError = true;
        this.overviewLoading = false;
      }
    });
  }

  open(route: string): void {
    this.router.navigateByUrl(route);
  }

  back(): void {
    this.router.navigateByUrl(this.auth.resolveDashboard(this.auth.currentUser()?.roles));
  }

  logout(): void {
    const request = this.auth.logout();
    if (!request) {
      this.router.navigateByUrl('/auth/login');
      return;
    }
    request.subscribe({
      next: () => this.router.navigateByUrl('/auth/login'),
      error: () => this.router.navigateByUrl('/auth/login')
    });
  }
}
