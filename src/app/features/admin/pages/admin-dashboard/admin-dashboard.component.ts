import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { AdminPortalOverview } from '../../../../core/models/admin-portal.model';
import { AdminPortalService } from '../../../../core/services/admin-portal.service';

interface Metric { label: string; value: string; icon: string; trend: string; }
interface Activity { title: string; detail: string; time: string; type: string; }
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

  overview: AdminPortalOverview | null = null;
  loading = true;
  errorMessage = '';
  private readonly refreshSubscription = new Subscription();

  get metrics(): Metric[] {
    const o = this.overview;
    if (!o) return [
      { label: 'Total Users', value: '—', icon: '◉', trend: 'Loading' },
      { label: 'Active Users', value: '—', icon: '◈', trend: 'Loading' },
      { label: 'New Users (30d)', value: '—', icon: '◇', trend: 'Loading' },
      { label: 'Organizations', value: '—', icon: '▦', trend: 'Loading' }
    ];
    return [
      { label: 'Total Users', value: String(o.totalUsers), icon: '◉', trend: `+${o.newUsersLast30Days} / 30d` },
      { label: 'Active Users', value: String(o.activeUsers), icon: '◈', trend: `${this.activeRate}% active` },
      { label: 'New Users (30d)', value: String(o.newUsersLast30Days), icon: '◇', trend: 'Last 30 days' },
      { label: 'Organizations', value: String(o.totalOrganizations), icon: '▦', trend: `+${o.newOrganizationsLast30Days} / 30d` }
    ];
  }

  get activities(): Activity[] { return []; }
  get activeRate(): number { return this.overview?.totalUsers ? Math.round(this.overview.activeUsers / this.overview.totalUsers * 100) : 0; }

  constructor(private readonly themeService: ThemeService, private readonly router: Router, private readonly authService: AuthService, private readonly adminPortalService: AdminPortalService) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    this.isSuperAdmin = (user?.roles || []).some(role => role.trim().toUpperCase() === 'SUPER_ADMIN');
    this.theme = this.themeService.theme;
    this.themeSubscription = this.themeService.theme$.subscribe(theme => this.theme = theme);
    this.loadOverview();
  }

  ngOnDestroy(): void { this.themeSubscription?.unsubscribe(); this.refreshSubscription.unsubscribe(); }

  loadOverview(): void {
    this.loading = true;
    this.errorMessage = '';
    this.adminPortalService.overview().subscribe({
      next: response => { this.overview = response.data; this.loading = false; },
      error: (error: Error) => { this.loading = false; this.errorMessage = error.message || 'Unable to load live admin data.'; }
    });
  }

  toggleTheme(): void { this.themeService.toggle(); }
  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }
  backToSuperAdmin(): void { this.router.navigateByUrl('/super-admin'); }
  openCurriculum(): void { this.router.navigateByUrl('/admin/curriculum'); }
  openAssessments(): void { this.router.navigateByUrl('/admin/assessments/new'); }
  openLearningPath(): void { this.router.navigateByUrl('/admin/learning-path'); }
}
