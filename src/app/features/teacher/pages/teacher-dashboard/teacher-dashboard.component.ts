import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LearningService, TeacherAnalytics } from '../../../../core/services/learning.service';

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
  analytics: TeacherAnalytics = {
    courseCount: 0,
    learnerCount: 0,
    assessmentCount: 0,
    completionRate: 0,
    publishedCourseCount: 0,
    draftCourseCount: 0
  };
  loading = true;
  error = '';

  get metrics(): Metric[] {
    return [
      { label: 'My Courses', value: String(this.analytics.courseCount), detail: `${this.analytics.publishedCourseCount} published · ${this.analytics.draftCourseCount} draft`, icon: '▣' },
      { label: 'Active Learners', value: String(this.analytics.learnerCount), detail: 'Learners enrolled in your courses', icon: '◉' },
      { label: 'Assessments', value: String(this.analytics.assessmentCount), detail: 'Knowledge checks you manage', icon: '✓' },
      { label: 'Completion Rate', value: `${this.analytics.completionRate}%`, detail: 'Average learner progress', icon: '↗' }
    ];
  }

  readonly quickActions = [
    { title: 'Create Course', description: 'Start a new learning experience', icon: '＋', route: '/teacher/courses' },
    { title: 'Build Assessment', description: 'Create assessments and knowledge checks', icon: '✓', route: '/teacher/assessments' },
    { title: 'Question Bank', description: 'Organize reusable assessment questions', icon: '▤', route: '/teacher/question-bank' },
    { title: 'Learner Progress', description: 'Review learner activity and mastery', icon: '◉', route: '/teacher/learners' }
  ];

  isLoggingOut = false;

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly learning: LearningService
  ) {}

  ngOnInit(): void {
    this.learning.getTeacherAnalytics().subscribe({
      next: response => {
        this.analytics = response.data || this.analytics;
        this.loading = false;
      },
      error: response => {
        this.error = response?.error?.message || 'Unable to load live teaching analytics.';
        this.loading = false;
      }
    });
  }

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
