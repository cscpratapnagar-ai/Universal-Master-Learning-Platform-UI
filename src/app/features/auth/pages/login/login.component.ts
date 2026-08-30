import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  private themeSubscription?: Subscription;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly themeService: ThemeService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl(
        this.authService.resolveDashboard(this.authService.currentUser()?.roles)
      );
      return;
    }

    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.theme = theme;
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
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
        this.router.navigateByUrl(this.authService.resolveDashboard(response.data?.user?.roles));
      },
      error: (error: Error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Unable to sign in.';
      }
    });
  }
}
