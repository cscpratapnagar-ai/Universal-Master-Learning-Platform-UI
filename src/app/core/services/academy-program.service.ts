import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { AcademyProgramOverview } from '../models/academy-program.model';

@Injectable({ providedIn: 'root' })
export class AcademyProgramService {
  constructor(private readonly http: HttpClient) {}

  overview(): Observable<ApiResponse<AcademyProgramOverview>> {
    return this.http.get<ApiResponse<AcademyProgramOverview>>(
      `${API_CONFIG.baseUrl}/academy/programs/overview`
    );
  }
}
