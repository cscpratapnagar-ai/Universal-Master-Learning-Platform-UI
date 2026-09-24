import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Subscription } from 'rxjs';

interface Metric { label: string; value: string; icon: string; trend: string; }
interface Activity { title: string; detail: string; time: string; type: string; }

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  theme: ThemeMode = 'dark';
  sidebarOpen = true;
  isSuperAdmin = false;
  private themeSubscription?: Subscription;

  readonly metrics: Metric[] = [
    { label: 'Total Users', value: '1,248', icon: '◉', trend: '+12.5%' },
    { label: 'Active Learners', value: '982', icon: '◈', trend: '+8.2%' },
    { label: 'Educators', value: '64', icon: '◇', trend: '+4.8%' },
    { label: 'Organizations', value: '18', icon: '▦', trend: '+2 this month' }
  ];

  readonly activities: Activity[] = [
    { title: 'New learner registered', detail: 'testuser@example.com joined the platform', time: 'Just now', type: 'user' },
    { title: 'Organization created', detail: 'Pratapnagar Learning Center was added', time: '18 min ago', type: 'org' },
    { title: 'New course published', detail: 'Advanced Mathematics is now live', time: '42 min ago', type: 'course' },
    { title: 'Platform backup completed', detail: 'Database backup finished successfully', time: '2 hours ago', type: 'system' }
  ];

  constructor(private readonly themeService: ThemeService, private readonly router: Router, private readonly authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    this.isSuperAdmin = (user?.roles || []).some(role => role.trim().toUpperCase() === 'SUPER_ADMIN');
    this.theme = this.themeService.theme;
    this.themeSubscription = this.themeService.theme$.subscribe(theme => this.theme = theme);
  }

  ngOnDestroy(): void { this.themeSubscription?.unsubscribe(); }

  toggleTheme(): void { this.themeService.toggle(); }
  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }
  backToSuperAdmin(): void { this.router.navigateByUrl('/super-admin'); }
  openCurriculum(): void { this.router.navigateByUrl('/admin/curriculum'); }
  openAssessments(): void { this.router.navigateByUrl('/admin/assessments/new'); }
  openLearningPath(): void { this.router.navigateByUrl('/admin/learning-path'); }
}
