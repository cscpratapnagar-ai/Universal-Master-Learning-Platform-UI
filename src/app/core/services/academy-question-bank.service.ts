import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { AcademyQuestionBankOverview } from '../models/academy-question-bank.model';

@Injectable({ providedIn: 'root' })
export class AcademyQuestionBankService {
  constructor(private readonly http: HttpClient) {}

  overview(): Observable<ApiResponse<AcademyQuestionBankOverview>> {
    return this.http.get<ApiResponse<AcademyQuestionBankOverview>>(
      `${API_CONFIG.baseUrl}/academy/question-bank/overview`
    );
  }
}
