import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { AcademyCourseOverview } from '../models/academy-course.model';

@Injectable({ providedIn: 'root' })
export class AcademyCourseService {
  constructor(private readonly http: HttpClient) {}

  overview(): Observable<ApiResponse<AcademyCourseOverview>> {
    return this.http.get<ApiResponse<AcademyCourseOverview>>(
      `${API_CONFIG.baseUrl}/academy/courses/overview`
    );
  }
}
