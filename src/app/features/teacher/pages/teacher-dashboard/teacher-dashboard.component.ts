import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

interface Metric {
  label: string;
  value: string;
  detail: string;
  icon: string;
}

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent {
  readonly metrics: Metric[] = [
    { label: 'My Courses', value: '0', detail: 'Courses you manage', icon: '▣' },
    { label: 'Active Learners', value: '0', detail: 'Learners enrolled', icon: '◉' },
    { label: 'Pending Reviews', value: '0', detail: 'Assessments to review', icon: '✓' },
    { label: 'Completion Rate', value: '—', detail: 'Across your courses', icon: '↗' }
  ];

  readonly quickActions = [
    { title: 'Create Course', description: 'Start a new learning experience', icon: '＋', route: '/teacher/courses' },
    { title: 'Build Assessment', description: 'Create questions and knowledge checks', icon: '✓', route: '/teacher/question-bank' },
    { title: 'Question Bank', description: 'Organize reusable assessment questions', icon: '▤', route: '/teacher/assessments' },
    { title: 'Learner Progress', description: 'Review learner activity and mastery', icon: '◉', route: '' }
  ];

  isLoggingOut = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  open(action: { route: string }): void {
    if (action.route) {
      this.router.navigateByUrl(action.route);
    }
  }

  logout(): void {
    if (this.isLoggingOut) return;
    this.isLoggingOut = true;

    const request = this.authService.logout();
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
