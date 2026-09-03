import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeMode, ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-super-admin-shell',
  templateUrl: './super-admin-shell.component.html',
  styleUrls: ['./super-admin-shell.component.scss']
})
export class SuperAdminShellComponent implements OnInit, OnDestroy {
  user: User | null = null;
  theme: ThemeMode = 'dark';
  isLoggingOut = false;
  readonly sections = [
    { label: 'Overview', route: '/super-admin', icon: '◈' },
    { label: 'Users', route: '/super-admin/users', icon: '◎' },
    { label: 'Organizations', route: '/super-admin/organizations', icon: '▦' },
    { label: 'Learning', route: '/admin', icon: '◇' },
    { label: 'Security', route: '/super-admin/security', icon: '◉' },
    { label: 'System', route: '/super-admin/system', icon: '⚙' }
  ];
  private readonly subscriptions = new Subscription();

  constructor(private readonly auth: AuthService, private readonly themeService: ThemeService, private readonly router: Router) {}

  ngOnInit(): void {
    this.user = this.auth.currentUser();
    this.subscriptions.add(this.themeService.theme$.subscribe(theme => this.theme = theme));
    if (!this.auth.isAuthenticated() || !this.user?.roles.includes('SUPER_ADMIN')) this.router.navigateByUrl('/auth/login');
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }
  toggleTheme(): void { this.themeService.toggle(); }

  logout(): void {
    if (this.isLoggingOut) return;
    this.isLoggingOut = true;
    const request = this.auth.logout();
    if (!request) { this.router.navigateByUrl('/auth/login'); return; }
    request.subscribe({ next: () => this.router.navigateByUrl('/auth/login'), error: () => this.router.navigateByUrl('/auth/login') });
  }
}