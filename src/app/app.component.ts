import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Universal Master Learning Platform';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.authService.restoreSession().subscribe(restored => {
      if (!restored && this.authService.hasStoredSession()) {
        this.router.navigateByUrl('/auth/login');
      }
    });
  }
}
