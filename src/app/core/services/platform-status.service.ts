import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { PlatformStatus } from '../models/platform-status.model';

@Injectable({ providedIn: 'root' })
export class PlatformStatusService {
  constructor(private readonly http: HttpClient) {}

  check(): Observable<boolean> {
    return this.http
      .get<ApiResponse<PlatformStatus>>(`${API_CONFIG.baseUrl}/public/status`)
      .pipe(
        map((response) => response.success && response.data.status === 'ONLINE'),
        catchError(() => of(false))
      );
  }
}
