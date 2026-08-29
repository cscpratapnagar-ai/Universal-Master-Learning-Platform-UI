import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import {
  ThemeMode,
  ThemeService
} from '../../../../core/services/theme.service';

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
    this.themeSubscription = this.themeService.theme$.subscribe(
      (theme: ThemeMode) => {
        this.theme = theme;
      }
    );
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    if (this.isSubmitting) {
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    this.authService
      .login(
        {
          email: this.email.trim().toLowerCase(),
          password: this.password
        },
        this.rememberMe
      )
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.router.navigateByUrl(this.resolveDashboard(response.data.user.roles));
        },
        error: (error: Error) => {
          this.isSubmitting = false;
          this.errorMessage = error.message;
        }
      });
  }

  private resolveDashboard(roles: string[]): string {
    if (roles.includes('SUPER_ADMIN')) {
      return '/super-admin';
    }

    if (roles.includes('ORG_ADMIN')) {
      return '/organization';
    }

    if (roles.includes('INSTRUCTOR')) {
      return '/instructor';
    }

    return '/learner';
  }
}
