import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { AcademyOverview } from '../models/academy.model';

@Injectable({ providedIn: 'root' })
export class AcademyService {
  constructor(private readonly http: HttpClient) {}

  overview(): Observable<ApiResponse<AcademyOverview>> {
    return this.http.get<ApiResponse<AcademyOverview>>(
      `${API_CONFIG.baseUrl}/academy/overview`
    );
  }
}
