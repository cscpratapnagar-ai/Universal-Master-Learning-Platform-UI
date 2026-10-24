import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
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
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password. Please check your details and try again.';
        } else if (error.status === 429) {
          this.errorMessage = 'Too many sign-in attempts. Please wait a moment and try again.';
        } else if (error.status === 0 || error.status >= 500) {
          this.errorMessage = 'Unable to reach the learning service right now. Please check that the backend is running and try again.';
        } else {
          this.errorMessage = error.error?.message || 'Unable to sign in. Please try again.';
        }
      }
    });
  }
}
