import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

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

  private themeSubscription?: Subscription;

  constructor(private readonly themeService: ThemeService) {}

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
    if (!this.passwordsMatch) {
      return;
    }

    console.log('Registration requested', {
      fullName: this.fullName,
      email: this.email
    });
  }
}
