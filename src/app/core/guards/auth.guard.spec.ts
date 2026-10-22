import { Router, UrlTree } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let guard: AuthGuard;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', [
      'restoreSession',
      'isAuthenticated'
    ]);
    router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    Object.defineProperty(router, 'url', { value: '/learner' });
    guard = new AuthGuard(authService, router);
  });

  it('waits for session restoration before allowing a protected route', async () => {
    authService.restoreSession.and.returnValue(of(true));
    authService.isAuthenticated.and.returnValue(true);

    const result = await firstValueFrom(guard.canActivate());

    expect(result).toBeTrue();
    expect(authService.restoreSession).toHaveBeenCalled();
  });

  it('redirects to login when session restoration fails', async () => {
    const loginTree = {} as UrlTree;
    authService.restoreSession.and.returnValue(of(false));
    router.createUrlTree.and.returnValue(loginTree);

    const result = await firstValueFrom(guard.canActivate());

    expect(result).toBe(loginTree);
    expect(router.createUrlTree).toHaveBeenCalledWith(
      ['/auth/login'],
      { queryParams: { returnUrl: '/learner' } }
    );
  });
});
