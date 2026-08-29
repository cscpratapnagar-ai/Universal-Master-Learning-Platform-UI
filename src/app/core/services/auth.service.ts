import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, finalize, tap } from 'rxjs';

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

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  login(request: LoginRequest, persistent = true): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.authUrl}/login`, request)
      .pipe(tap((response) => this.storeSession(response, persistent)));
  }

  register(request: RegisterRequest, persistent = true): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.authUrl}/register`, request)
      .pipe(tap((response) => this.storeSession(response, persistent)));
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token is available.');
    }

    const request: RefreshTokenRequest = { refreshToken };

    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.authUrl}/refresh`, request)
      .pipe(tap((response) => this.storeSession(response, true)));
  }

  logout(): Observable<ApiResponse<void>> | null {
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      this.tokenService.clearSession();
      return null;
    }

    const request: LogoutRequest = { refreshToken };

    return this.http
      .post<ApiResponse<void>>(`${this.authUrl}/logout`, request)
      .pipe(finalize(() => this.tokenService.clearSession()));
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getAccessToken();
  }

  currentUser(): User | null {
    return this.tokenService.getCurrentUser();
  }

  private storeSession(
    response: ApiResponse<AuthResponse>,
    persistent: boolean
  ): void {
    if (response.success && response.data) {
      this.tokenService.saveSession(response.data, persistent);
    }
  }
}
