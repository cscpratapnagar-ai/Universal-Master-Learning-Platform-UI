import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse, StudentCourse, CourseLearning } from '../models/learning.model';

export interface LearningPathStatus {
  enrollmentId: string;
  courseId: string;
  progressPercent: number;
  completedLessonsCount: number;
  availableLessonsCount: number;
  lockedLessonsCount: number;
  totalLessonsCount: number;
  isCourseCompleted: boolean;
  courseCompletedAt?: string | null;
  nextRecommendedLesson: { lessonId?: string; title?: string; sortOrder?: number; completed?: boolean; locked?: boolean };
  lessons: { lessonId: string; title: string; sortOrder: number; completed: boolean; locked: boolean; status: 'COMPLETED' | 'AVAILABLE' | 'LOCKED'; pendingPrerequisiteCount: number }[];
}

export interface LearningPathLesson {
  id: string;
  title: string;
  sortOrder: number;
  completionMode: string;
  prerequisiteLessonIds: string[];
}

export interface LearningPathModule {
  id: string;
  title: string;
  sortOrder: number;
  lessons: LearningPathLesson[];
}

export interface LearningPathCourse {
  id: string;
  title: string;
  status: string;
  modules: LearningPathModule[];
}

@Injectable({ providedIn: 'root' })
export class LearningService {
  private readonly base = API_CONFIG.baseUrl;

  constructor(private readonly http: HttpClient) {}

  myCourses(): Observable<ApiResponse<StudentCourse[]>> {
    return this.http.get<ApiResponse<StudentCourse[]>>(
      `${this.base}/student/courses/me`
    );
  }

  courseLearning(enrollmentId: string): Observable<ApiResponse<CourseLearning>> {
    return this.http.get<ApiResponse<CourseLearning>>(
      `${this.base}/student/learning/enrollments/${encodeURIComponent(enrollmentId)}`
    );
  }

  getLearningPath(enrollmentId: string): Observable<ApiResponse<LearningPathStatus>> {
    return this.http.get<ApiResponse<LearningPathStatus>>(
      `${this.base}/student/learning/enrollments/${encodeURIComponent(enrollmentId)}/learning-path`
    );
  }

  completeLesson(enrollmentId: string, lessonId: string): Observable<unknown> {
    return this.http.post(
      `${this.base}/student/learning/enrollments/${encodeURIComponent(enrollmentId)}/lessons/${encodeURIComponent(lessonId)}/complete`,
      {}
    );
  }

  adminLearningCatalog(): Observable<ApiResponse<LearningPathCourse[]>> {
    return this.http.get<ApiResponse<LearningPathCourse[]>>(
      `${this.base}/admin/learning/catalog`
    );
  }

  getPrerequisites(lessonId: string): Observable<ApiResponse<LearningPathLesson[]>> {
    return this.http.get<ApiResponse<LearningPathLesson[]>>(
      `${this.base}/admin/learning-path/lessons/${encodeURIComponent(lessonId)}/prerequisites`
    );
  }

  addPrerequisite(lessonId: string, prerequisiteLessonId: string): Observable<ApiResponse<LearningPathLesson>> {
    return this.http.post<ApiResponse<LearningPathLesson>>(
      `${this.base}/admin/learning-path/lessons/${encodeURIComponent(lessonId)}/prerequisites/${encodeURIComponent(prerequisiteLessonId)}`,
      {}
    );
  }

  removePrerequisite(lessonId: string, prerequisiteLessonId: string): Observable<ApiResponse<unknown>> {
    return this.http.delete<ApiResponse<unknown>>(
      `${this.base}/admin/learning-path/lessons/${encodeURIComponent(lessonId)}/prerequisites/${encodeURIComponent(prerequisiteLessonId)}`
    );
  }
}
