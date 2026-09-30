import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { AcademyTeacherOverview } from '../models/academy-teacher.model';

@Injectable({ providedIn: 'root' })
export class AcademyTeacherService {
  constructor(private readonly http: HttpClient) {}

  overview(): Observable<ApiResponse<AcademyTeacherOverview>> {
    return this.http.get<ApiResponse<AcademyTeacherOverview>>(
      `${API_CONFIG.baseUrl}/academy/teachers/overview`
    );
  }
}
