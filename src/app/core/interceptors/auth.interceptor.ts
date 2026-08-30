import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly tokenService: TokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.tokenService.getAccessToken();

    if (
      !accessToken ||
      !request.url.startsWith(API_CONFIG.baseUrl) ||
      this.isPublicRequest(request.url)
    ) {
      return next.handle(request);
    }

    return next.handle(request.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    }));
  }

  private isPublicRequest(url: string): boolean {
    return /\/api\/v1\/(auth\/(login|register|refresh|logout)|public\/|health)/.test(url);
  }
}
