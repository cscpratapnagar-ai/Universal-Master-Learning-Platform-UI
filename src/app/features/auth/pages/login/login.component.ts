import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  theme: ThemeMode = 'dark';
  showPassword = false;
  rememberMe = true;
  email = '';
  password = '';
  isSubmitting = false;
  errorMessage = '';
  existingUser = this.authService.currentUser();
  returnUrl = '/';

  private themeSubscription?: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly themeService: ThemeService
  ) {}

  ngOnInit(): void {
    const requestedUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (requestedUrl && requestedUrl.startsWith('/') && !requestedUrl.startsWith('//')) {
      this.returnUrl = requestedUrl;
    }
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  switchAccount(): void {
    this.authService.switchAccount();
    this.existingUser = null;
    this.errorMessage = '';
  }

  continueAsCurrentUser(): void {
    this.router.navigateByUrl(
      this.targetAfterLogin()
    );
  }

  private targetAfterLogin(roles?: string[] | null): string {
    const currentRoles = roles ?? this.existingUser?.roles;
    if (this.returnUrl !== '/' && currentRoles?.length) {
      return this.returnUrl;
    }
    return this.authService.resolveDashboard(currentRoles);
  }

  toggleTheme(): void { this.themeService.toggle(); }
  togglePassword(): void { this.showPassword = !this.showPassword; }

  submit(): void {
    if (this.isSubmitting || !this.email.trim() || !this.password) return;

    this.errorMessage = '';
    this.isSubmitting = true;

    this.authService.login({
      email: this.email.trim().toLowerCase(),
      password: this.password
    }, this.rememberMe).subscribe({
      next: response => {
        this.isSubmitting = false;
        const dashboard = this.targetAfterLogin(response.data?.user?.roles);
        this.router.navigateByUrl(dashboard).catch(() => {
          this.errorMessage = `Unable to open the ${dashboard.replace('/', '') || 'learning'} workspace. Please refresh and try again.`;
        });
      },
      error: (error: Error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Unable to sign in.';
      }
    });
  }
}
