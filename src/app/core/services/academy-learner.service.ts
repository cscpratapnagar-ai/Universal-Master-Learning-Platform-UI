import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { AcademyLearnerOverview } from '../models/academy-learner.model';

@Injectable({ providedIn: 'root' })
export class AcademyLearnerService {
  constructor(private readonly http: HttpClient) {}

  overview(): Observable<ApiResponse<AcademyLearnerOverview>> {
    return this.http.get<ApiResponse<AcademyLearnerOverview>>(
      `${API_CONFIG.baseUrl}/academy/learners/overview`
    );
  }
}
