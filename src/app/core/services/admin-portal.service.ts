import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { AdminPortalOverview } from '../models/admin-portal.model';

@Injectable({ providedIn: 'root' })
export class AdminPortalService {
  constructor(private readonly http: HttpClient) {}
  overview(): Observable<ApiResponse<AdminPortalOverview>> {
    return this.http.get<ApiResponse<AdminPortalOverview>>(`${API_CONFIG.baseUrl}/admin/overview`);
  }
}
