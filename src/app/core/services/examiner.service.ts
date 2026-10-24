import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';

export interface ExaminerAssessment {
  assessmentId: string;
  assessmentTitle: string;
  assessmentLevel: string;
  courseId: string;
  courseTitle: string;
  passingScore: number;
  maxAttempts: number;
  submittedAttemptCount: number;
  evaluatorAssignmentCount: number;
}
export interface AssignedEvaluator {
  assignmentId: string;
  evaluatorId: string;
  evaluatorEmail: string;
  assignedAt: string;
  assessmentId: string;
}
@Injectable({ providedIn: 'root' })
export class ExaminerService {
  private readonly base = API_CONFIG.baseUrl + '/examiner/assessments';
  constructor(private readonly http: HttpClient) {}
  overview(): Observable<ApiResponse<ExaminerAssessment[]>> {
    return this.http.get<ApiResponse<ExaminerAssessment[]>>(this.base);
  }
  evaluators(assessmentId: string): Observable<ApiResponse<AssignedEvaluator[]>> {
    return this.http.get<ApiResponse<AssignedEvaluator[]>>(`${this.base}/${encodeURIComponent(assessmentId)}/evaluators`);
  }
}