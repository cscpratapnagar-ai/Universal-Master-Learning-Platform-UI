import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';

export interface RoleRequest {
  id: string; userId: string; userName: string; userEmail: string;
  requestedRole: string; status: 'PENDING'|'APPROVED'|'REJECTED';
  reason: string; rejectionReason: string;
}

@Injectable({providedIn:'root'})
export class RoleRequestService {
  private readonly base = API_CONFIG.baseUrl;
  constructor(private readonly http: HttpClient) {}
  list(status: 'PENDING'|'APPROVED'|'REJECTED'|'ALL' = 'PENDING'): Observable<ApiResponse<RoleRequest[]>> {
    return this.http.get<ApiResponse<RoleRequest[]>>(this.base + '/admin/role-requests', { params: { status } });
  }

  pending(): Observable<ApiResponse<RoleRequest[]>> {
    return this.list('PENDING');
  }
  approve(id: string): Observable<ApiResponse<RoleRequest>> {
    return this.http.post<ApiResponse<RoleRequest>>(
      this.base + '/admin/role-requests/' + encodeURIComponent(id) + '/approve',
      {},
      { observe: 'body', responseType: 'json' }
    );
  }

  reject(id: string, reason?: string): Observable<ApiResponse<RoleRequest>> {
    const url = this.base + '/admin/role-requests/' + encodeURIComponent(id) + '/reject';
    if (reason?.trim()) {
      return this.http.post<ApiResponse<RoleRequest>>(
        url,
        {},
        { params: { reason: reason.trim() }, observe: 'body', responseType: 'json' }
      );
    }
    return this.http.post<ApiResponse<RoleRequest>>(
      url,
      {},
      { observe: 'body', responseType: 'json' }
    );
  }
}