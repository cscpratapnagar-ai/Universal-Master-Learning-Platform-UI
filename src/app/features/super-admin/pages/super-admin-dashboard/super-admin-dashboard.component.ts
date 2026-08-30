import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { InternalPortalOverview } from '../../../../core/models/internal-portal.model';
import { AuthService } from '../../../../core/services/auth.service';
import { InternalPortalService } from '../../../../core/services/internal-portal.service';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.scss']
})
export class SuperAdminDashboardComponent implements OnInit {
  overview: InternalPortalOverview | null = null;
  loading = true;
  errorMessage = '';
  activeSection = 'Overview';
  lastRefresh = new Date();

  readonly sections = ['Overview', 'Users', 'Organizations', 'Learning', 'Security', 'System'];

  constructor(
    private readonly authService: AuthService,
    private readonly internalPortalService: InternalPortalService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();

    if (!this.authService.isAuthenticated() || !user?.roles.includes('SUPER_ADMIN')) {
      this.router.navigateByUrl('/auth/login');
      return;
    }

    this.loadOverview();
  }

  loadOverview(): void {
    this.loading = true;
    this.errorMessage = '';

    this.internalPortalService.overview().subscribe({
      next: (response) => {
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

  selectSection(section: string): void {
    this.activeSection = section;
  }

  logout(): void {
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
