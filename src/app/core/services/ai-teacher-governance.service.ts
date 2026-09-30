import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { AiTeacherGovernanceOverview } from '../models/ai-teacher-governance.model';

@Injectable({ providedIn: 'root' })
export class AiTeacherGovernanceService {
  constructor(private readonly http: HttpClient) {}

  overview(): Observable<ApiResponse<AiTeacherGovernanceOverview>> {
    return this.http.get<ApiResponse<AiTeacherGovernanceOverview>>(
      `${API_CONFIG.baseUrl}/admin/ai-teacher/overview`
    );
  }
}
