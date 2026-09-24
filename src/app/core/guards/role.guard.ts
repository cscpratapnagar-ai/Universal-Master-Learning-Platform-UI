import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/auth/login']);
    }

    const allowedRoles = (route.data['roles'] as string[] | undefined)?.map(role => role.trim().toUpperCase());
    const user = this.authService.currentUser();

    if (!allowedRoles?.length) {
      return true;
    }

    const userRoles = (user?.roles ?? []).map(role => role.trim().toUpperCase());
    const hasRole = userRoles.some(role => allowedRoles.includes(role));

    if (hasRole) {
      return true;
    }

    return this.router.createUrlTree([this.authService.resolveDashboard(user?.roles)]);
  }
}
