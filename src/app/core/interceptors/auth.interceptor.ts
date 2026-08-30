import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(API_CONFIG.baseUrl) || this.isPublicRequest(request.url)) {
      return next.handle(request);
    }

    return next.handle(this.withAccessToken(request)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401 || request.headers.has('X-Auth-Retry')) {
          return throwError(() => error);
        }

        return this.authService.refreshSession().pipe(
          switchMap(refreshed => {
            if (!refreshed) return throwError(() => error);

            return next.handle(
              this.withAccessToken(request).clone({
                setHeaders: { 'X-Auth-Retry': 'true' }
              })
            );
          })
        );
      })
    );
  }

  private withAccessToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const accessToken = this.tokenService.getAccessToken();
    return accessToken
      ? request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
      : request;
  }

  private isPublicRequest(url: string): boolean {
    return /\/api\/v1\/(auth\/(login|register|refresh|logout)|public\/|health)/.test(url);
  }
}
