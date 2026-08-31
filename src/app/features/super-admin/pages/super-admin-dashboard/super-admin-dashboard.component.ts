import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
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
    { label: 'May 20', value: 42, color: 'violet' }, { label: 'May 27', value: 58, color: 'blue' },
    { label: 'Jun 03', value: 46, color: 'cyan' }, { label: 'Jun 10', value: 74, color: 'green' },
    { label: 'Jun 17', value: 67, color: 'orange' }, { label: 'Today', value: 92, color: 'pink' }
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
    this.subscriptions.add(interval(30000).subscribe(() => this.loadOverview(false)));
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }

  loadOverview(showLoader = true): void {
    if (showLoader) this.loading = true;
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
  trendHeight(value: number): number { return Math.max(14, value); }

  get greeting(): string {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  }

  get activeUserRate(): number {
    if (!this.overview?.totalUsers) return 0;
    return Math.round((this.overview.activeUsers / this.overview.totalUsers) * 100);
  }

  get activeOrganizationRate(): number {
    if (!this.overview?.totalOrganizations) return 0;
    return Math.round((this.overview.activeOrganizations / this.overview.totalOrganizations) * 100);
  }
}
