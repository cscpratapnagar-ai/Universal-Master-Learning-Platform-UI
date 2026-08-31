import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse, StudentCourse, CourseLearning } from '../models/learning.model';

@Injectable({ providedIn: 'root' })
export class LearningService {
  private readonly base = API_CONFIG.baseUrl;

  constructor(private readonly http: HttpClient) {}

  myCourses(userId: string): Observable<ApiResponse<StudentCourse[]>> {
    return this.http.get<ApiResponse<StudentCourse[]>>(
      `${this.base}/student/courses/users/${encodeURIComponent(userId)}`
    );
  }

  courseLearning(enrollmentId: string): Observable<ApiResponse<CourseLearning>> {
    return this.http.get<ApiResponse<CourseLearning>>(
      `${this.base}/student/learning/enrollments/${encodeURIComponent(enrollmentId)}`
    );
  }

  completeLesson(enrollmentId: string, lessonId: string): Observable<unknown> {
    return this.http.post(
      `${this.base}/student/learning/enrollments/${encodeURIComponent(enrollmentId)}/lessons/${encodeURIComponent(lessonId)}/complete`,
      {}
    );
  }
}
