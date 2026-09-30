import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { PrivateTeacherAvailability, PrivateTeacherOverview } from '../models/private-teacher.model';

@Injectable({ providedIn: 'root' })
export class PrivateTeacherService {
  constructor(private readonly http: HttpClient) {}

  overview(): Observable<ApiResponse<PrivateTeacherOverview>> {
    return this.http.get<ApiResponse<PrivateTeacherOverview>>(`${API_CONFIG.baseUrl}/private-teacher/overview`);
  }

  availability(): Observable<ApiResponse<PrivateTeacherAvailability[]>> {
    return this.http.get<ApiResponse<PrivateTeacherAvailability[]>>(`${API_CONFIG.baseUrl}/private-teacher/availability/me`);
  }

  addAvailability(payload: {dayOfWeek: string; startTime: string; endTime: string; timezone: string}): Observable<ApiResponse<PrivateTeacherAvailability>> {
    return this.http.post<ApiResponse<PrivateTeacherAvailability>>(`${API_CONFIG.baseUrl}/private-teacher/availability/me`, payload);
  }
}
