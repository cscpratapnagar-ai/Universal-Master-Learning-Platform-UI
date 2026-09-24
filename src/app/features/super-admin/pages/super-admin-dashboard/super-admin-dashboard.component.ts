import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { User } from '../../../../core/models/auth.model';
import { InternalPortalOverview } from '../../../../core/models/internal-portal.model';
import { AuthService } from '../../../../core/services/auth.service';
import { InternalPortalService } from '../../../../core/services/internal-portal.service';
import { UserManagementService } from '../../../../core/services/user-management.service';
import { OrganizationService } from '../../../../core/services/organization.service';
import { ManagedUser } from '../../../../core/models/user-management.model';
import { Organization } from '../../../../core/models/organization.model';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';
import { RoleRequest, RoleRequestService } from '../../../../core/services/role-request.service';

interface TrendPoint { label: string; value: number; color: string; }
interface DashboardActivity {
  title: string;
  detail: string;
  time: string;
  icon: string;
  tone: string;
}
interface QuickAction {
  label: string;
  icon: string;
  tone: string;
  route: string;
}

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
  recentUsers: ManagedUser[] = [];
  recentOrganizations: Organization[] = [];
  intelligenceWarning = '';
  pendingRoleRequests: RoleRequest[] = [];
  private readonly subscriptions = new Subscription();

  readonly quickSignals = [
    { title: 'User directory', detail: 'Identity data is live', icon: '◉', tone: 'cyan' },
    { title: 'Organization tenants', detail: 'Tenant data is live', icon: '▦', tone: 'violet' },
    { title: 'Access governance', detail: 'Role approvals are live', icon: '◇', tone: 'orange' }
  ];

  readonly activities: DashboardActivity[] = [];

  activityTrend: TrendPoint[] = [
    { label: 'May 20', value: 0, color: 'violet' }, { label: 'May 27', value: 0, color: 'blue' },
    { label: 'Jun 03', value: 0, color: 'cyan' }, { label: 'Jun 10', value: 0, color: 'green' },
    { label: 'Jun 17', value: 0, color: 'orange' }, { label: 'Today', value: 0, color: 'pink' }
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly internalPortalService: InternalPortalService,
    private readonly userManagementService: UserManagementService,
    private readonly organizationService: OrganizationService,
    private readonly roleRequestService: RoleRequestService,
    private readonly themeService: ThemeService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser();
    this.subscriptions.add(this.themeService.theme$.subscribe(theme => this.theme = theme));
    if (!this.authService.isAuthenticated() || !this.user?.roles.some(role => role.trim().toUpperCase() === 'SUPER_ADMIN')) {
      this.router.navigateByUrl('/auth/login');
      return;
    }
    this.loadOverview();
    this.loadIntelligence();
    this.loadRoleRequests();
    this.subscriptions.add(interval(30000).subscribe(() => { this.loadOverview(false); this.loadIntelligence(); this.loadRoleRequests(); }));
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }

  loadOverview(showLoader = true): void {
    if (showLoader) this.loading = true;
    this.errorMessage = '';
    this.internalPortalService.overview().subscribe({
      next: response => {
        this.overview = response.data;
        this.syncLiveAnalytics();
        this.loading = false;
        this.lastRefresh = new Date();
      },
      error: (error: Error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Unable to load internal portal data.';
      }
    });
  }

  loadRoleRequests(): void {
    this.roleRequestService.pending().subscribe({
      next: response => this.pendingRoleRequests = response.data || [],
      error: () => this.intelligenceWarning = 'Some live governance data is temporarily unavailable.'
    });
  }

  loadIntelligence(): void {
    this.userManagementService.getAll().subscribe({
      next: response => this.recentUsers = (response.data || []).slice(0, 5),
      error: () => this.intelligenceWarning = 'Some live intelligence data is temporarily unavailable.'
    });
    this.organizationService.getAll().subscribe({
      next: response => this.recentOrganizations = (response.data || []).slice(0, 5),
      error: () => this.intelligenceWarning = 'Some live intelligence data is temporarily unavailable.'
    });
  }

  userInitials(user: ManagedUser): string {
    const initials = (user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '');
    return initials || 'U';
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

  private syncLiveAnalytics(): void {
    if (!this.overview) return;

    const total = Math.max(1, this.overview.totalUsers);
    const roleEntries = Object.entries(this.overview.usersByRole || {})
      .sort(([, a], [, b]) => b - a);

    this.activityTrend = [
      { label: 'Users', value: Math.min(100, Math.round((this.overview.activeUsers / total) * 100)), color: 'violet' },
      { label: '30d New', value: Math.min(100, Math.round((this.overview.newUsersLast30Days / total) * 100)), color: 'blue' },
      { label: 'Orgs', value: Math.min(100, Math.round((this.overview.activeOrganizations / Math.max(1, this.overview.totalOrganizations)) * 100)), color: 'cyan' },
      { label: '30d Orgs', value: Math.min(100, Math.round((this.overview.newOrganizationsLast30Days / Math.max(1, this.overview.totalOrganizations)) * 100)), color: 'green' },
      { label: roleEntries[0]?.[0] || 'Roles', value: Math.min(100, Math.round(((roleEntries[0]?.[1] || 0) / total) * 100)), color: 'orange' },
      { label: roleEntries[1]?.[0] || 'Mix', value: Math.min(100, Math.round(((roleEntries[1]?.[1] || 0) / total) * 100)), color: 'pink' }
    ];
  }

  get roleDistribution(): Array<{ role: string; count: number; percent: number }> {
    if (!this.overview?.usersByRole) return [];
    const total = Math.max(1, this.overview.totalUsers);
    return Object.entries(this.overview.usersByRole)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([role, count]) => ({
        role: role.replaceAll('_', ' '),
        count,
        percent: Math.round((count / total) * 100)
      }));
  }

  get pendingRoleRequestCount(): number { return this.pendingRoleRequests.length; }

  get liveSignalCount(): number { return this.quickSignals.length; }

  get activeOrganizationRate(): number {
    if (!this.overview?.totalOrganizations) return 0;
    return Math.round((this.overview.activeOrganizations / this.overview.totalOrganizations) * 100);
  }
}
