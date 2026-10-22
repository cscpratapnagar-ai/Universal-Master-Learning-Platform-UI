import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.restoreSession().pipe(
      map((restored) => this.authorize(restored))
    );
  }

  canLoad(_route: Route, _segments: UrlSegment[]): Observable<boolean | UrlTree> {
    return this.authService.restoreSession().pipe(
      map((restored) => this.authorize(restored))
    );
  }

  private authorize(restored: boolean): boolean | UrlTree {
    if (restored && this.authService.isAuthenticated()) {
      return true;
    }

    return this.router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
  }
}
