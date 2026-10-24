import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';

export interface EvaluatorAssignment {
  id: string;
  assessmentId: string;
  assessmentTitle: string;
  courseTitle?: string;
  assignedAt?: string;
}
export interface EvaluatorAttempt {
  attemptId: string;
  userId?: string;
  learnerName?: string;
  learnerEmail?: string;
  attemptNumber?: number;
  score?: number;
  passed?: boolean;
  masteryLevel?: string;
  submittedAt?: string;
}
export interface EvaluatorAnswer {
  answerId: string;
  questionId: string;
  questionText: string;
  questionType: string;
  maxPoints: number;
  selectedOptionId?: string;
  selectedOptionText?: string;
  correct?: boolean;
  pointsAwarded?: number;
}
export interface EvaluatorAttemptDetail extends EvaluatorAttempt {
  assessmentId: string;
  assessmentTitle?: string;
  answers: EvaluatorAnswer[];
}
export interface EvaluatorReview {
  reviewId: string;
  attemptId: string;
  reviewerId: string;
  remarks: string;
  reviewedAt: string;
}
@Injectable({ providedIn: 'root' })
export class EvaluatorService {
  private readonly base = API_CONFIG.baseUrl + '/evaluator/assignments';
  constructor(private readonly http: HttpClient) {}

  myAssignments(): Observable<ApiResponse<EvaluatorAssignment[]>> {
    return this.http.get<ApiResponse<EvaluatorAssignment[]>>(`${this.base}/mine`);
  }
  attempts(assessmentId: string): Observable<ApiResponse<EvaluatorAttempt[]>> {
    return this.http.get<ApiResponse<EvaluatorAttempt[]>>(`${this.base}/${encodeURIComponent(assessmentId)}/attempts`);
  }
  attemptDetail(assessmentId: string, attemptId: string): Observable<ApiResponse<EvaluatorAttemptDetail>> {
    return this.http.get<ApiResponse<EvaluatorAttemptDetail>>(`${this.base}/${encodeURIComponent(assessmentId)}/attempts/${encodeURIComponent(attemptId)}`);
  }
  getReview(assessmentId: string, attemptId: string): Observable<ApiResponse<EvaluatorReview>> {
    return this.http.get<ApiResponse<EvaluatorReview>>(`${this.base}/${encodeURIComponent(assessmentId)}/attempts/${encodeURIComponent(attemptId)}/review`);
  }
  saveReview(assessmentId: string, attemptId: string, remarks: string): Observable<ApiResponse<EvaluatorReview>> {
    return this.http.put<ApiResponse<EvaluatorReview>>(`${this.base}/${encodeURIComponent(assessmentId)}/attempts/${encodeURIComponent(attemptId)}/review`, { remarks });
  }
}