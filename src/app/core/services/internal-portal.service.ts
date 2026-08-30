import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { InternalPortalOverview } from '../models/internal-portal.model';

@Injectable({ providedIn: 'root' })
export class InternalPortalService {
  constructor(private readonly http: HttpClient) {}

  overview(): Observable<ApiResponse<InternalPortalOverview>> {
    return this.http.get<ApiResponse<InternalPortalOverview>>(
      `${API_CONFIG.baseUrl}/internal/overview`
    );
  }
}
