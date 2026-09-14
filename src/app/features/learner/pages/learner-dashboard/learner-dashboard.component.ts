import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../../core/models/auth.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';
import { LearningService } from '../../../../core/services/learning.service';
import { StudentCourse } from '../../../../core/models/learning.model';
import { AiLearningOrchestration, PersonalizationOrchestration } from '../../../../core/models/ai-learning.model';

interface DashboardStat { label: string; value: string; change: string; icon: string; }

@Component({ selector: 'app-learner-dashboard', templateUrl: './learner-dashboard.component.html', styleUrls: ['./learner-dashboard.component.scss', './learner-dashboard-premium.scss'] })
export class LearnerDashboardComponent implements OnInit {
  user: User | null = null;
  isLoggingOut = false;
  activeNav = 'Overview';
  notificationsOpen = false;
  theme: ThemeMode = 'dark';
  courses: StudentCourse[] = [];
  ai: AiLearningOrchestration | null = null;
  personalization: PersonalizationOrchestration | null = null;
  intelligenceLoading = false;

  readonly navigation = [
    { label: 'Overview', icon: '⌂' }, { label: 'My Learning', icon: '▣' }, { label: 'Live Classes', icon: '◉' },
    { label: 'AI Tutor', icon: '✦' }, { label: 'Assessments', icon: '✓' }, { label: 'Certificates', icon: '◇' }
  ];

  get stats(): DashboardStat[] { return [
    { label: 'Learning streak', value: '7', change: 'Keep going!', icon: '🔥' },
    { label: 'Learning pace', value: this.personalization?.pace || '—', change: 'AI guided', icon: '◷' },
    { label: 'Courses active', value: String(this.courses.length).padStart(2, '0'), change: 'Live data', icon: '▣' },
    { label: 'Next priority', value: this.personalization?.priority || '—', change: this.ai?.learnerState || 'AI guided', icon: '◎' }
  ]; }

  get todayLabel(): string { return new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()); }

  constructor(private readonly authService: AuthService, private readonly themeService: ThemeService, private readonly router: Router, private readonly learning: LearningService) {}

  ngOnInit(): void {
    this.theme = this.themeService.theme;
    this.themeService.theme$.subscribe(theme => this.theme = theme);
    if (!this.authService.isAuthenticated()) { this.router.navigateByUrl('/auth/login'); return; }
    this.user = this.authService.currentUser(); this.loadCourses();
  }

  private loadCourses(): void { this.learning.myCourses().subscribe({ next: response => { this.courses = response.data || []; this.loadIntelligence(); }, error: () => this.courses = [] }); }
  private loadIntelligence(): void {
    const enrollmentId = this.courses[0]?.enrollmentId; if (!enrollmentId) return; this.intelligenceLoading = true;
    this.learning.getAiOrchestration(enrollmentId).subscribe({ next: response => this.ai = response.data, error: () => this.ai = null });
    this.learning.getPersonalizationOrchestration(enrollmentId).subscribe({ next: response => this.personalization = response.data, error: () => this.personalization = null, complete: () => this.intelligenceLoading = false });
  }
  get nextLessonTitle(): string { return this.personalization?.targetLessonTitle || 'Your next learning step'; }
  get nextAction(): string { return this.personalization?.finalAction || this.ai?.recommendedAction || 'CONTINUE_LEARNING'; }
  toggleTheme(): void { this.themeService.toggle(); }
  selectNav(label: string): void {
    this.activeNav = label;
    const routes: Record<string, string> = { Overview: '/learner', 'My Learning': '/learner/courses', Assessments: '/learner/quiz', Certificates: '/learner/certificates' };
    const route = routes[label]; if (route) this.router.navigateByUrl(route);
  }
  continueCourse(course: StudentCourse): void { this.router.navigate(['/learner/course', course.enrollmentId]); }
  logout(): void {
    if (this.isLoggingOut) return; this.isLoggingOut = true; const request = this.authService.logout();
    if (!request) { this.router.navigateByUrl('/auth/login'); return; }
    request.subscribe({ next: () => this.router.navigateByUrl('/auth/login'), error: () => this.router.navigateByUrl('/auth/login') });
  }
}
