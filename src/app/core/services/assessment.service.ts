import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class AssessmentService {
  private readonly base = API_CONFIG.baseUrl;

  constructor(private readonly http: HttpClient) {}

  submit(
    assessmentId: string,
    userId: string,
    answers: Record<string, string>
  ): Observable<unknown> {
    return this.http.post(
      `${this.base}/student/assessments/${encodeURIComponent(assessmentId)}/submit`,
      { userId, answers }
    );
  }
}
