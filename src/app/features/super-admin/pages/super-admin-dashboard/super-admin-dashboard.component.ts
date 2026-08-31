import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../../core/models/auth.model';
import { InternalPortalOverview } from '../../../../core/models/internal-portal.model';
import { AuthService } from '../../../../core/services/auth.service';
import { InternalPortalService } from '../../../../core/services/internal-portal.service';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';

interface TrendPoint { label: string; value: number; color: string; }

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.scss']
})
export class SuperAdminDashboardComponent implements OnInit, OnDestroy {
  user: User | null = null;
  overview: InternalPortalOverview | null = null;
  loading = true;
  errorMessage = '';
  theme: ThemeMode = 'dark';
  lastRefresh = new Date();
  private readonly subscriptions = new Subscription();

  readonly activityTrend: TrendPoint[] = [
    { label: 'May 20', value: 42, color: 'violet' },
    { label: 'May 27', value: 58, color: 'blue' },
    { label: 'Jun 03', value: 46, color: 'cyan' },
    { label: 'Jun 10', value: 74, color: 'green' },
    { label: 'Jun 17', value: 67, color: 'orange' },
    { label: 'Today', value: 92, color: 'pink' }
  ];

  readonly courses = [
    { title: 'Complete Java Development', students: '4,702', progress: 85, tone: 'violet', icon: '☕' },
    { title: 'Data Structures & Algorithms', students: '3,921', progress: 78, tone: 'blue', icon: '⌘' },
    { title: 'Full Stack Development', students: '3,156', progress: 72, tone: 'green', icon: '◫' },
    { title: 'Python for Beginners', students: '2,945', progress: 65, tone: 'orange', icon: '⌁' },
    { title: 'UI/UX Design Masterclass', students: '2,156', progress: 60, tone: 'pink', icon: '✦' }
  ];

  readonly activities = [
    { icon: '▦', title: 'New organization registered', detail: 'ABC Institute joined the platform', time: '2 min ago', tone: 'violet' },
    { icon: '◎', title: 'New user onboarded', detail: 'Platform identity provisioned', time: '5 min ago', tone: 'blue' },
    { icon: '▣', title: 'Course catalog updated', detail: 'Learning content is live', time: '15 min ago', tone: 'pink' },
    { icon: '₹', title: 'Payment received', detail: 'Revenue pipeline synchronized', time: '20 min ago', tone: 'green' },
    { icon: '♙', title: 'Teacher joined', detail: 'Instructor profile verified', time: '30 min ago', tone: 'orange' }
  ];

  readonly quickActions = [
    { icon: '▦', label: 'Add Organization', route: '/super-admin/organizations', tone: 'violet' },
    { icon: '◎', label: 'Manage Users', route: '/super-admin/users', tone: 'blue' },
    { icon: '◇', label: 'Learning Center', route: '/super-admin/learning', tone: 'orange' },
    { icon: '◉', label: 'Security', route: '/super-admin/security', tone: 'pink' },
    { icon: '⚙', label: 'System', route: '/super-admin/system', tone: 'cyan' }
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly internalPortalService: InternalPortalService,
    private readonly themeService: ThemeService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser();
    this.subscriptions.add(this.themeService.theme$.subscribe(theme => this.theme = theme));
    if (!this.authService.isAuthenticated() || !this.user?.roles.includes('SUPER_ADMIN')) {
      this.router.navigateByUrl('/auth/login');
      return;
    }
    this.loadOverview();
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }

  loadOverview(): void {
    this.loading = true;
    this.errorMessage = '';
    this.internalPortalService.overview().subscribe({
      next: response => {
        this.overview = response.data;
        this.loading = false;
        this.lastRefresh = new Date();
      },
      error: (error: Error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Unable to load internal portal data.';
      }
    });
  }

  toggleTheme(): void { this.themeService.toggle(); }
  navigate(route: string): void { this.router.navigateByUrl(route); }

  trendHeight(value: number): number {
    return Math.max(14, Math.round((value / 100) * 100));
  }

  get greeting(): string {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  }
}