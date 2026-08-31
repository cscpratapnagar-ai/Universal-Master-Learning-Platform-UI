import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { ManagedUser, UpdateUserRolesRequest, UpdateUserStatusRequest } from '../models/user-management.model';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private readonly url = API_CONFIG.baseUrl + '/users';

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  getAll(query?: string, enabled?: boolean): Observable<ApiResponse<ManagedUser[]>> {
    const params: Record<string, string> = {};
    if (query?.trim()) params['query'] = query.trim();
    if (enabled !== undefined) params['enabled'] = String(enabled);

    return this.http.get<ApiResponse<ManagedUser[]>>(
      this.url,
      { params, headers: this.authHeaders() }
    );
  }

  updateStatus(id: string, request: UpdateUserStatusRequest): Observable<ApiResponse<ManagedUser>> {
    return this.http.put<ApiResponse<ManagedUser>>(
      this.url + '/' + id + '/status',
      request,
      { headers: this.authHeaders() }
    );
  }

  updateRoles(id: string, request: UpdateUserRolesRequest): Observable<ApiResponse<ManagedUser>> {
    return this.http.put<ApiResponse<ManagedUser>>(
      this.url + '/' + id + '/roles',
      request,
      { headers: this.authHeaders() }
    );
  }

  private authHeaders(): HttpHeaders {
    const token = this.tokenService.getAccessToken();

    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }
}