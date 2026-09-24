import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse, StudentCourse, CourseLearning } from '../models/learning.model';
import { AiLearningOrchestration, PersonalizationOrchestration } from '../models/ai-learning.model';
import { AiTutorRequest, AiTutorResponse } from '../models/ai-tutor.model';

export interface LearningProgressAnalytics { enrollmentId:string; courseId:string; courseTitle:string; completionPercent:number; completedLessons:number; totalLessons:number; remainingLessons:number; activeLessons:number; learningSeconds:number; learningMinutes:number; masteryScore:number; masteryLevel:'MASTERED'|'PROFICIENT'|'DEVELOPING'|'EMERGING'|'NOT_ASSESSED'; momentum:'EXCELLENT'|'ON_TRACK'|'BUILDING'|'STARTING'; assessmentCount:number; assessments:{assessmentId:string;lessonId?:string|null;title:string;score:number;masteryLevel:string;passed:boolean;submittedAt:string}[]; }
export interface LearningPathStatus { enrollmentId:string; courseId:string; progressPercent:number; completedLessonsCount:number; availableLessonsCount:number; lockedLessonsCount:number; totalLessonsCount:number; isCourseCompleted:boolean; courseCompletedAt?:string|null; nextRecommendedLesson:{lessonId?:string;title?:string;sortOrder?:number;completed?:boolean;locked?:boolean}; lessons:{lessonId:string;title:string;sortOrder:number;completed:boolean;locked:boolean;status:'COMPLETED'|'AVAILABLE'|'LOCKED';pendingPrerequisiteCount:number}[]; }
export interface LearningPathLesson { id:string; title:string; sortOrder:number; completionMode:string; prerequisiteLessonIds:string[]; }
export interface LearningPathModule { id:string; title:string; sortOrder:number; lessons:LearningPathLesson[]; }
export interface LearningPathCourse { id:string; title:string; status:string; modules:LearningPathModule[]; }
export interface TeacherAnalytics { courseCount:number; learnerCount:number; assessmentCount:number; completionRate:number; publishedCourseCount:number; draftCourseCount:number; }
export interface TeacherLearner { enrollmentId:string; courseId:string; courseTitle:string; learnerId:string; learnerName:string; learnerEmail:string; progressPercent:number; completed:boolean; completedAt?:string|null; }

export interface CreateCourseRequest { title:string; slug:string; description?:string; organizationId?:string|null; }
export interface CourseResponse { id:string; title:string; slug:string; description?:string|null; status:string; organizationId?:string|null; }

export interface CreateModuleRequest { title:string; sortOrder:number; }
export interface CreateLessonRequest { title:string; contentType?:string; content?:string; sortOrder:number; }

@Injectable({providedIn:'root'})
export class LearningService {
  private readonly base=API_CONFIG.baseUrl;
  constructor(private readonly http:HttpClient){}
  myCourses():Observable<ApiResponse<StudentCourse[]>>{return this.http.get<ApiResponse<StudentCourse[]>>(`${this.base}/student/courses/me`);}
  courseLearning(enrollmentId:string):Observable<ApiResponse<CourseLearning>>{return this.http.get<ApiResponse<CourseLearning>>(`${this.base}/student/learning/enrollments/${encodeURIComponent(enrollmentId)}`);}
  getProgressAnalytics(enrollmentId:string):Observable<ApiResponse<LearningProgressAnalytics>>{return this.http.get<ApiResponse<LearningProgressAnalytics>>(`${this.base}/student/learning/enrollments/${encodeURIComponent(enrollmentId)}/progress`);}
  getLearningPath(enrollmentId:string):Observable<ApiResponse<LearningPathStatus>>{return this.http.get<ApiResponse<LearningPathStatus>>(`${this.base}/student/learning/enrollments/${encodeURIComponent(enrollmentId)}/learning-path`);}
  getAiOrchestration(enrollmentId:string):Observable<ApiResponse<AiLearningOrchestration>>{return this.http.get<ApiResponse<AiLearningOrchestration>>(`${this.base}/student/learning/enrollments/${encodeURIComponent(enrollmentId)}/ai/orchestration`);}
  getPersonalizationOrchestration(enrollmentId:string):Observable<ApiResponse<PersonalizationOrchestration>>{return this.http.get<ApiResponse<PersonalizationOrchestration>>(`${this.base}/student/learning/enrollments/${encodeURIComponent(enrollmentId)}/personalization/orchestration`);}
  respondToAiTutor(enrollmentId:string,question:string):Observable<ApiResponse<AiTutorResponse>>{return this.http.post<ApiResponse<AiTutorResponse>>(`${this.base}/student/learning/enrollments/${encodeURIComponent(enrollmentId)}/ai-tutor/respond`,{question} satisfies AiTutorRequest);}
  completeLesson(enrollmentId:string,lessonId:string):Observable<unknown>{return this.http.post(`${this.base}/student/learning/enrollments/${encodeURIComponent(enrollmentId)}/lessons/${encodeURIComponent(lessonId)}/complete`,{});}
  getTeacherAnalytics():Observable<ApiResponse<TeacherAnalytics>>{return this.http.get<ApiResponse<TeacherAnalytics>>(`${this.base}/teacher/analytics`);}
  getTeacherLearners():Observable<ApiResponse<TeacherLearner[]>>{return this.http.get<ApiResponse<TeacherLearner[]>>(`${this.base}/teacher/learners`);}
  adminLearningCatalog():Observable<ApiResponse<LearningPathCourse[]>>{return this.http.get<ApiResponse<LearningPathCourse[]>>(`${this.base}/admin/learning/catalog`);}
  createCourse(request:CreateCourseRequest):Observable<ApiResponse<CourseResponse>>{return this.http.post<ApiResponse<CourseResponse>>(`${this.base}/courses`,request);}
  publishCourse(courseId:string):Observable<ApiResponse<CourseResponse>>{return this.http.put<ApiResponse<CourseResponse>>(`${this.base}/courses/${encodeURIComponent(courseId)}/publish`,{});}
  createModule(courseId:string,request:CreateModuleRequest):Observable<ApiResponse<{id:string;title:string}>>{return this.http.post<ApiResponse<{id:string;title:string}>>(`${this.base}/learning/courses/${encodeURIComponent(courseId)}/modules`,request);}
  createLesson(moduleId:string,request:CreateLessonRequest):Observable<ApiResponse<{id:string;title:string}>>{return this.http.post<ApiResponse<{id:string;title:string}>>(`${this.base}/learning/modules/${encodeURIComponent(moduleId)}/lessons`,request);}
  updateLessonCompletionMode(lessonId:string,completionMode:string):Observable<ApiResponse<{id:string;completionMode:string}>>{return this.http.patch<ApiResponse<{id:string;completionMode:string}>>(`${this.base}/learning/lessons/${encodeURIComponent(lessonId)}/completion-mode`,{completionMode});}
  createAssessment(courseId:string,request:{title:string;passingScore:number}):Observable<ApiResponse<{id:string;title:string}>>{return this.http.post<ApiResponse<{id:string;title:string}>>(`${this.base}/assessments/courses/${encodeURIComponent(courseId)}`,request);}
  getCourseAssessments(courseId:string):Observable<ApiResponse<{id:string;title:string;level:string;passingScore:number;maxAttempts:number}[]>>{return this.http.get<ApiResponse<{id:string;title:string;level:string;passingScore:number;maxAttempts:number}[]>>(`${this.base}/assessments/courses/${encodeURIComponent(courseId)}`);}
  getQuestionBank(courseId:string,filters?:{difficultyLevel?:string;questionType?:string}):Observable<ApiResponse<any[]>>{const params=new URLSearchParams();if(filters?.difficultyLevel)params.set('difficultyLevel',filters.difficultyLevel);if(filters?.questionType)params.set('questionType',filters.questionType);const query=params.toString();return this.http.get<ApiResponse<any[]>>(`${this.base}/assessments/question-bank/courses/${encodeURIComponent(courseId)}${query?`?${query}`:''}`);}
  reuseAssessmentQuestion(assessmentId:string,questionId:string):Observable<ApiResponse<{id:string;assessmentId:string}>>{return this.http.post<ApiResponse<{id:string;assessmentId:string}>>(`${this.base}/assessments/${encodeURIComponent(assessmentId)}/questions/${encodeURIComponent(questionId)}/reuse`,{});}
  createAssessmentQuestion(assessmentId:string,request:{questionText:string;questionType:string;points:number;difficultyLevel?:string;options:{text:string;correct:boolean}[]}):Observable<ApiResponse<{id:string}>>{return this.http.post<ApiResponse<{id:string}>>(`${this.base}/assessments/${encodeURIComponent(assessmentId)}/questions`,request);}
  getPrerequisites(lessonId:string):Observable<ApiResponse<LearningPathLesson[]>>{return this.http.get<ApiResponse<LearningPathLesson[]>>(`${this.base}/admin/learning-path/lessons/${encodeURIComponent(lessonId)}/prerequisites`);}
  addPrerequisite(lessonId:string,prerequisiteLessonId:string):Observable<ApiResponse<LearningPathLesson>>{return this.http.post<ApiResponse<LearningPathLesson>>(`${this.base}/admin/learning-path/lessons/${encodeURIComponent(lessonId)}/prerequisites/${encodeURIComponent(prerequisiteLessonId)}`,{});}
  removePrerequisite(lessonId:string,prerequisiteLessonId:string):Observable<ApiResponse<unknown>>{return this.http.delete<ApiResponse<unknown>>(`${this.base}/admin/learning-path/lessons/${encodeURIComponent(lessonId)}/prerequisites/${encodeURIComponent(prerequisiteLessonId)}`);}
}
