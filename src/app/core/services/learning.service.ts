import { Injectable } from '@angular/core'; import { HttpClient } from '@angular/common/http'; import { Observable } from 'rxjs'; import { ApiResponse,StudentCourse,CourseLearning } from '../models/learning.model';
@Injectable({providedIn:'root'}) export class LearningService {
 private readonly base='http://localhost:8080/api/v1';
 constructor(private readonly http:HttpClient){}
 myCourses(userId:string):Observable<ApiResponse<StudentCourse[]>>{return this.http.get<ApiResponse<StudentCourse[]>>(`${this.base}/student/courses/users/${userId}`);}
 courseLearning(enrollmentId:string):Observable<ApiResponse<CourseLearning>>{return this.http.get<ApiResponse<CourseLearning>>(`${this.base}/student/learning/enrollments/${enrollmentId}`);}
 completeLesson(enrollmentId:string,lessonId:string):Observable<any>{return this.http.post(`${this.base}/student/learning/enrollments/${enrollmentId}/lessons/${lessonId}/complete`,{});}
}