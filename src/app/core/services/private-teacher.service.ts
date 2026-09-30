import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { PrivateTeacherOverview } from '../models/private-teacher.model';

@Injectable({ providedIn: 'root' })
export class PrivateTeacherService {
  constructor(private readonly http: HttpClient) {}

  overview(): Observable<ApiResponse<PrivateTeacherOverview>> {
    return this.http.get<ApiResponse<PrivateTeacherOverview>>(
      `${API_CONFIG.baseUrl}/private-teacher/overview`
    );
  }
}
