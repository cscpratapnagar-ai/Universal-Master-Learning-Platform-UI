import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  theme: ThemeMode = 'dark';
  showPassword = false;
  showConfirmPassword = false;
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  acceptedTerms = false;
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

  get passwordsMatch(): boolean {
    return !this.confirmPassword || this.password === this.confirmPassword;
  }

  toggleTheme(): void { this.themeService.toggle(); }
  togglePassword(): void { this.showPassword = !this.showPassword; }
  toggleConfirmPassword(): void { this.showConfirmPassword = !this.showConfirmPassword; }

  submit(): void {
    if (
      this.isSubmitting ||
      !this.acceptedTerms ||
      !this.fullName.trim() ||
      !this.email.trim() ||
      this.password.length < 8 ||
      !this.passwordsMatch
    ) {
      return;
    }

    const { firstName, lastName } = this.splitName(this.fullName);
    this.errorMessage = '';
    this.isSubmitting = true;

    this.authService.register({
      firstName,
      lastName,
      email: this.email.trim().toLowerCase(),
      password: this.password
    }).subscribe({
      next: response => {
        this.isSubmitting = false;
        this.router.navigateByUrl(this.authService.resolveDashboard(response.data?.user?.roles));
      },
      error: (error: Error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Unable to create your account.';
      }
    });
  }

  private splitName(fullName: string): { firstName: string; lastName: string | null } {
    const parts = fullName.trim().split(/\s+/);
    return {
      firstName: parts[0],
      lastName: parts.length > 1 ? parts.slice(1).join(' ') : null
    };
  }
}
