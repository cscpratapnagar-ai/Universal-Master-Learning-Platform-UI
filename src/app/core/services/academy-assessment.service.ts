import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { AcademyAssessmentOverview } from '../models/academy-assessment.model';

@Injectable({ providedIn: 'root' })
export class AcademyAssessmentService {
  constructor(private readonly http: HttpClient) {}

  overview(): Observable<ApiResponse<AcademyAssessmentOverview>> {
    return this.http.get<ApiResponse<AcademyAssessmentOverview>>(
      `${API_CONFIG.baseUrl}/academy/assessments/overview`
    );
  }
}
