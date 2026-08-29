import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

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

  toggleTheme(): void {
    this.themeService.toggle();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    console.log('Login requested', {
      email: this.email,
      rememberMe: this.rememberMe
    });
  }
}
