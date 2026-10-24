import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let guard: RoleGuard;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', [
      'isAuthenticated',
      'currentUser',
      'resolveDashboard'
    ]);
    router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    guard = new RoleGuard(authService, router);
  });

  function route(roles?: string[]): ActivatedRouteSnapshot {
    return { data: roles ? { roles } : {} } as ActivatedRouteSnapshot;
  }

  it('redirects unauthenticated users to login', () => {
    const loginTree = {} as UrlTree;
    authService.isAuthenticated.and.returnValue(false);
    router.createUrlTree.and.returnValue(loginTree);

    expect(guard.canActivate(route(['EXAMINER']))).toBe(loginTree);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/auth/login']);
    expect(authService.currentUser).not.toHaveBeenCalled();
  });

  it('allows a user with the required role, ignoring case and surrounding spaces', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.currentUser.and.returnValue({ roles: [' learner ', 'examiner'] } as any);

    expect(guard.canActivate(route(['EXAMINER']))).toBeTrue();
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('redirects a signed-in user without the required role to their own dashboard', () => {
    const dashboardTree = {} as UrlTree;
    authService.isAuthenticated.and.returnValue(true);
    authService.currentUser.and.returnValue({ roles: ['LEARNER'] } as any);
    authService.resolveDashboard.and.returnValue('/learner');
    router.createUrlTree.and.returnValue(dashboardTree);

    expect(guard.canActivate(route(['PROCTOR']))).toBe(dashboardTree);
    expect(authService.resolveDashboard).toHaveBeenCalledWith(['LEARNER']);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/learner']);
  });

  it('does not accidentally deny a route when no role restriction is configured', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.currentUser.and.returnValue({ roles: ['LEARNER'] } as any);

    expect(guard.canActivate(route())).toBeTrue();
  });
});
