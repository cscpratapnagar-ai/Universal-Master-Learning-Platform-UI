import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

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
    { title: 'Courses', description: 'Create, manage and publish academy learning experiences.', icon: '▣', route: '/teacher/courses', tone: 'blue' },
    { title: 'Teachers', description: 'Open the teaching studio and manage educator workflows.', icon: '✦', route: '/teacher', tone: 'purple' },
    { title: 'Learners', description: 'Review learner activity, progress and engagement.', icon: '◉', route: '/teacher/learners', tone: 'cyan' },
    { title: 'Assessments', description: 'Build knowledge checks and assessment experiences.', icon: '✓', route: '/teacher/assessments', tone: 'orange' },
    { title: 'Question Bank', description: 'Organize reusable questions for academy assessments.', icon: '▤', route: '/teacher/question-bank', tone: 'green' },
    { title: 'Exam Portal', description: 'Launch the secure examination experience.', icon: '▥', route: '/exam-portal', tone: 'pink' },
    { title: 'AI Teacher', description: 'Give learners intelligent teaching support inside courses.', icon: 'AI', route: '/learner', tone: 'gold' },
    { title: 'Organization', description: 'Open the organization governance workspace when assigned.', icon: '▦', route: '/organization', tone: 'navy' }
  ];

  constructor(private readonly router: Router, private readonly auth: AuthService) {}

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
