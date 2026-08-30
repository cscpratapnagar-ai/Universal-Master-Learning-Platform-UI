import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../../core/models/auth.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';

interface DashboardStat {
  label: string;
  value: string;
  change: string;
  icon: string;
}

interface LearningCourse {
  title: string;
  category: string;
  progress: number;
  lessons: string;
  accent: string;
}

interface ActivityItem {
  title: string;
  meta: string;
  icon: string;
}

@Component({
  selector: 'app-learner-dashboard',
  templateUrl: './learner-dashboard.component.html',
  styleUrls: ['./learner-dashboard.component.scss']
})
export class LearnerDashboardComponent implements OnInit {
  user: User | null = null;
  isLoggingOut = false;
  activeNav = 'Overview';
  notificationsOpen = false;
  theme: ThemeMode = 'dark';

  readonly navigation = [
    { label: 'Overview', icon: '⌂' },
    { label: 'My Learning', icon: '▣' },
    { label: 'Live Classes', icon: '◉' },
    { label: 'AI Tutor', icon: '✦' },
    { label: 'Assessments', icon: '✓' },
    { label: 'Certificates', icon: '◇' }
  ];

  readonly stats: DashboardStat[] = [
    { label: 'Learning streak', value: '12 days', change: '+3 this week', icon: '↗' },
    { label: 'Hours learned', value: '48.5', change: '+6.2 hrs', icon: '◷' },
    { label: 'Courses active', value: '04', change: '1 completed', icon: '▣' },
    { label: 'Average score', value: '92%', change: '+4.8%', icon: '◎' }
  ];

  readonly courses: LearningCourse[] = [
    { title: 'Advanced Mathematics', category: 'Mathematics', progress: 75, lessons: '18 / 24 lessons', accent: 'violet' },
    { title: 'Modern Physics', category: 'Science', progress: 42, lessons: '10 / 24 lessons', accent: 'cyan' },
    { title: 'Critical Thinking', category: 'Personal Development', progress: 28, lessons: '7 / 25 lessons', accent: 'pink' }
  ];

  readonly activity: ActivityItem[] = [
    { title: 'Completed Algebra assessment', meta: 'Today · Score 94%', icon: '✓' },
    { title: 'AI Tutor learning session', meta: 'Yesterday · 28 minutes', icon: '✦' },
    { title: 'Joined Modern Physics class', meta: 'Aug 28 · Live session', icon: '◉' }
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly themeService: ThemeService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.theme = this.themeService.theme;
    this.themeService.theme$.subscribe((theme: ThemeMode) => this.theme = theme);

    if (!this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/auth/login');
      return;
    }

    this.user = this.authService.currentUser();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  selectNav(label: string): void {
    this.activeNav = label;
  }

  continueCourse(course: LearningCourse): void {
    // Course routing will connect here when the learning module API is added.
    this.activeNav = 'My Learning';
    console.info('Continue learning:', course.title);
  }

  logout(): void {
    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;
    const request = this.authService.logout();

    if (!request) {
      this.router.navigateByUrl('/auth/login');
      return;
    }

    request.subscribe({
      next: () => this.router.navigateByUrl('/auth/login'),
      error: () => {
        this.isLoggingOut = false;
        this.router.navigateByUrl('/auth/login');
      }
    });
  }
}
