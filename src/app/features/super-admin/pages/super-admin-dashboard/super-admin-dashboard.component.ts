import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { User } from '../../../../core/models/auth.model';
import { InternalPortalOverview } from '../../../../core/models/internal-portal.model';
import { AuthService } from '../../../../core/services/auth.service';
import { InternalPortalService } from '../../../../core/services/internal-portal.service';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';

interface TrendPoint { label: string; value: number; }

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
  activeSection = 'Overview';
  lastRefresh = new Date();
  isLoggingOut = false;
  theme: ThemeMode = 'dark';

  readonly sections = ['Overview', 'Users', 'Organizations', 'Learning', 'Security', 'System'];
  readonly activityTrend: TrendPoint[] = [
    { label: 'Mon', value: 42 }, { label: 'Tue', value: 58 }, { label: 'Wed', value: 46 },
    { label: 'Thu', value: 74 }, { label: 'Fri', value: 67 }, { label: 'Sat', value: 88 },
    { label: 'Sun', value: 96 }
  ];
  readonly healthMetrics = [
    { label: 'API', value: 99.98, suffix: '%', detail: 'Response reliability' },
    { label: 'Database', value: 99.99, suffix: '%', detail: 'Connection health' },
    { label: 'Security', value: 100, suffix: '%', detail: 'Protected routes' }
  ];
  readonly pulseItems = [
    { icon: '↗', title: 'Protected API active', text: 'JWT authorization is enforcing internal access.', tone: 'positive' },
    { icon: '◉', title: 'Live data sync', text: 'Overview metrics are read from the backend.', tone: 'primary' },
    { icon: '✦', title: 'Control center ready', text: 'Management modules can expand from this foundation.', tone: 'neutral' }
  ];

  private readonly subscriptions = new Subscription();

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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadOverview(): void {
    this.loading = true;
    this.errorMessage = '';
    this.internalPortalService.overview().subscribe({
      next: response => {
        this.loading = false;
        this.overview = response.data;
        this.lastRefresh = new Date();
      },
      error: (error: Error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Unable to load internal portal data.';
      }
    });
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  selectSection(section: string): void {
    this.activeSection = section;

    const routes: Record<string, string> = {
      Overview: '/super-admin',
      Organizations: '/super-admin/organizations'
    };

    const route = routes[section];
    if (route) {
      this.router.navigateByUrl(route);
    }
  }

  trendHeight(value: number): number {
    return Math.max(12, Math.round((value / 100) * 100));
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
