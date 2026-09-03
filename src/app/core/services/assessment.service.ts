import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';

export interface AssessmentOption { id: string; optionText: string; }
export interface AssessmentQuestion { id: string; questionText: string; questionType: string; points: number; options: AssessmentOption[]; }
export interface AssessmentView { id: string; title: string; level: string; passingScore: number; maxAttempts: number; questions: AssessmentQuestion[]; }

@Injectable({ providedIn: 'root' })
export class AssessmentService {
  private readonly base = API_CONFIG.baseUrl;

  constructor(private readonly http: HttpClient) {}

  forLesson(lessonId: string): Observable<ApiResponse<AssessmentView[]>> {
    return this.http.get<ApiResponse<AssessmentView[]>>(
      `${this.base}/student/assessments/lessons/${encodeURIComponent(lessonId)}`
    );
  }

  get(assessmentId: string): Observable<ApiResponse<AssessmentView>> {
    return this.http.get<ApiResponse<AssessmentView>>(
      `${this.base}/student/assessments/${encodeURIComponent(assessmentId)}`
    );
  }

  submit(assessmentId: string, answers: Record<string, string>): Observable<ApiResponse<unknown>> {
    return this.http.post<ApiResponse<unknown>>(
      `${this.base}/student/assessments/${encodeURIComponent(assessmentId)}/submit`,
      { answers }
    );
  }

  createCourse(courseId: string, payload: { title: string; passingScore: number; maxAttempts?: number }) {
    return this.http.post<ApiResponse<unknown>>(`${this.base}/assessments/courses/${encodeURIComponent(courseId)}`, payload);
  }

  createModule(moduleId: string, payload: { title: string; passingScore: number; maxAttempts?: number }) {
    return this.http.post<ApiResponse<unknown>>(`${this.base}/assessments/modules/${encodeURIComponent(moduleId)}`, payload);
  }

  createLesson(lessonId: string, payload: { title: string; passingScore: number; maxAttempts?: number }) {
    return this.http.post<ApiResponse<unknown>>(`${this.base}/assessments/lessons/${encodeURIComponent(lessonId)}`, payload);
  }

  createQuestion(assessmentId: string, payload: { questionText: string; questionType: string; points: number; options: { text: string; correct: boolean }[] }) {
    return this.http.post<ApiResponse<unknown>>(`${this.base}/assessments/${encodeURIComponent(assessmentId)}/questions`, payload);
  }
}
