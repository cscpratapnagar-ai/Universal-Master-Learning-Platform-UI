import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { ManagedUser, UpdateUserRolesRequest, UpdateUserStatusRequest } from '../models/user-management.model';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private readonly url = API_CONFIG.baseUrl + '/users';

  constructor(private readonly http: HttpClient) {}

  getAll(query?: string, enabled?: boolean): Observable<ApiResponse<ManagedUser[]>> {
    const params: Record<string, string> = {};
    if (query?.trim()) params['query'] = query.trim();
    if (enabled !== undefined) params['enabled'] = String(enabled);
    return this.http.get<ApiResponse<ManagedUser[]>>(this.url, { params });
  }

  updateStatus(id: string, request: UpdateUserStatusRequest): Observable<ApiResponse<ManagedUser>> {
    return this.http.put<ApiResponse<ManagedUser>>(this.url + '/' + id + '/status', request);
  }

  updateRoles(id: string, request: UpdateUserRolesRequest): Observable<ApiResponse<ManagedUser>> {
    return this.http.put<ApiResponse<ManagedUser>>(this.url + '/' + id + '/roles', request);
  }
}