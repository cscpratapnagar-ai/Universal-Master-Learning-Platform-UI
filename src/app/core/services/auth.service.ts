import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, finalize, map, of, shareReplay, tap } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import {
  AuthResponse,
  LoginRequest,
  LogoutRequest,
  RefreshTokenRequest,
  RegisterRequest,
  User
} from '../models/auth.model';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authUrl = `${API_CONFIG.baseUrl}/auth`;
  private refreshInFlight$: Observable<boolean> | null = null;
  private readonly sessionReadySubject = new BehaviorSubject<boolean>(false);
  readonly sessionReady$ = this.sessionReadySubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  login(request: LoginRequest, persistent = true): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.authUrl}/login`, request)
      .pipe(tap(response => this.storeSession(response, persistent)));
  }

  register(request: RegisterRequest, persistent = true): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.authUrl}/register`, request)
      .pipe(tap(response => this.storeSession(response, persistent)));
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token is available.');
    }

    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.authUrl}/refresh`,
      { refreshToken } as RefreshTokenRequest
    ).pipe(tap(response => this.storeSession(response, true)));
  }

  forgotPassword(email: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.authUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.authUrl}/reset-password`, { token, newPassword });
  }

  logout(): Observable<ApiResponse<void>> | null {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      this.tokenService.clearSession();
      return null;
    }

    return this.http.post<ApiResponse<void>>(
      `${this.authUrl}/logout`,
      { refreshToken } as LogoutRequest
    ).pipe(finalize(() => this.tokenService.clearSession()));
  }

  hasStoredSession(): boolean {
    return !!this.tokenService.getAccessToken() || !!this.tokenService.getRefreshToken();
  }

  restoreSession(): Observable<boolean> {
    if (this.tokenService.getAccessToken()) {
      this.sessionReadySubject.next(true);
      return of(true);
    }

    if (!this.tokenService.getRefreshToken()) {
      this.sessionReadySubject.next(true);
      return of(false);
    }

    return this.refreshSession();
  }

  refreshSession(): Observable<boolean> {
    if (this.refreshInFlight$) return this.refreshInFlight$;

    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) return of(false);

    this.refreshInFlight$ = this.http.post<ApiResponse<AuthResponse>>(
      `${this.authUrl}/refresh`,
      { refreshToken } as RefreshTokenRequest
    ).pipe(
      tap(response => this.storeSession(response, true)),
      map(() => true),
      catchError(() => {
        this.tokenService.clearSession();
        return of(false);
      }),
      finalize(() => {
        this.refreshInFlight$ = null;
        this.sessionReadySubject.next(true);
      }),
      shareReplay(1)
    );

    return this.refreshInFlight$;
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getAccessToken();
  }

  currentUser(): User | null {
    return this.tokenService.getCurrentUser();
  }

  resolveDashboard(roles: string[] | undefined | null): string {
    const roleSet = new Set(roles ?? []);
    if (roleSet.has('SUPER_ADMIN')) return '/super-admin';
    if (roleSet.has('ORG_ADMIN')) return '/organization';
    if (roleSet.has('INSTRUCTOR')) return '/instructor';
    return '/learner';
  }

  private storeSession(response: ApiResponse<AuthResponse>, persistent: boolean): void {
    if (!response.success || !response.data?.accessToken || !response.data?.refreshToken || !response.data?.user) {
      throw new Error(response.message || 'Authentication response is incomplete.');
    }
    this.tokenService.saveSession(response.data, persistent);
  }
}
