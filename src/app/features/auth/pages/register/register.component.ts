import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';
import {
  ThemeMode,
  ThemeService
} from '../../../../core/services/theme.service';

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
    this.themeSubscription = this.themeService.theme$.subscribe(
      (theme: ThemeMode) => {
        this.theme = theme;
      }
    );
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  get passwordsMatch(): boolean {
    return !this.confirmPassword || this.password === this.confirmPassword;
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  submit(): void {
    if (!this.passwordsMatch || this.isSubmitting) {
      return;
    }

    const { firstName, lastName } = this.splitName(this.fullName);

    this.errorMessage = '';
    this.isSubmitting = true;

    this.authService
      .register({
        firstName,
        lastName,
        email: this.email.trim().toLowerCase(),
        password: this.password
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigateByUrl('/learner');
        },
        error: (error: Error) => {
          this.isSubmitting = false;
          this.errorMessage = error.message;
        }
      });
  }

  private splitName(fullName: string): {
    firstName: string;
    lastName: string | null;
  } {
    const [firstName, ...remaining] = fullName.trim().split(/\s+/);

    return {
      firstName,
      lastName: remaining.length ? remaining.join(' ') : null
    };
  }
}
