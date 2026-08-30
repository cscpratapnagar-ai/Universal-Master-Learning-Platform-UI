import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../../core/models/auth.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-learner-dashboard',
  templateUrl: './learner-dashboard.component.html',
  styleUrls: ['./learner-dashboard.component.scss']
})
export class LearnerDashboardComponent implements OnInit {
  user: User | null = null;
  isLoggingOut = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/auth/login');
      return;
    }

    this.user = this.authService.currentUser();
  }

  logout(): void {
    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;
    const request = this.authService.logout();

    if (!request) {
      this.router.navigateByUrl('/auth/login');
      return;
    }

    request.subscribe({
      next: () => this.router.navigateByUrl('/auth/login'),
      error: () => {
        this.isLoggingOut = false;
        this.router.navigateByUrl('/auth/login');
      }
    });
  }
}
