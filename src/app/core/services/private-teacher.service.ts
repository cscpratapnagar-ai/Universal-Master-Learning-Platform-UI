import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { PrivateTeacherAvailability,PrivateTeacherMatch,PrivateTeacherOverview,PrivateTeacherProfile,PrivateTeacherSession,PrivateTeacherSessionRequest } from '../models/private-teacher.model';

@Injectable({providedIn:'root'})
export class PrivateTeacherService{
constructor(private readonly http:HttpClient){}
overview():Observable<ApiResponse<PrivateTeacherOverview>>{return this.http.get<ApiResponse<PrivateTeacherOverview>>(`${API_CONFIG.baseUrl}/private-teacher/overview`);}
availability():Observable<ApiResponse<PrivateTeacherAvailability[]>>{return this.http.get<ApiResponse<PrivateTeacherAvailability[]>>(`${API_CONFIG.baseUrl}/private-teacher/availability/me`);}
addAvailability(p:any):Observable<ApiResponse<PrivateTeacherAvailability>>{return this.http.post<ApiResponse<PrivateTeacherAvailability>>(`${API_CONFIG.baseUrl}/private-teacher/availability/me`,p);}
profile():Observable<ApiResponse<PrivateTeacherProfile>>{return this.http.get<ApiResponse<PrivateTeacherProfile>>(`${API_CONFIG.baseUrl}/private-teacher/profile/me`);}
saveProfile(p:PrivateTeacherProfile):Observable<ApiResponse<PrivateTeacherProfile>>{return this.http.put<ApiResponse<PrivateTeacherProfile>>(`${API_CONFIG.baseUrl}/private-teacher/profile/me`,p);}
match(p:any):Observable<ApiResponse<PrivateTeacherMatch[]>>{return this.http.post<ApiResponse<PrivateTeacherMatch[]>>(`${API_CONFIG.baseUrl}/private-teacher/matching/search`,p);}
sessions():Observable<ApiResponse<PrivateTeacherSession[]>>{return this.http.get<ApiResponse<PrivateTeacherSession[]>>(`${API_CONFIG.baseUrl}/private-teacher/sessions/mine`);}
confirm(id:string){return this.http.post<ApiResponse<PrivateTeacherSession>>(`${API_CONFIG.baseUrl}/private-teacher/sessions/${id}/confirm`,{});}
cancel(id:string){return this.http.post<ApiResponse<PrivateTeacherSession>>(`${API_CONFIG.baseUrl}/private-teacher/sessions/${id}/cancel`,{});}
complete(id:string){return this.http.post<ApiResponse<PrivateTeacherSession>>(`${API_CONFIG.baseUrl}/private-teacher/sessions/${id}/complete`,{});}
teacherAvailability(teacherId:string):Observable<ApiResponse<PrivateTeacherAvailability[]>>{return this.http.get<ApiResponse<PrivateTeacherAvailability[]>>(`${API_CONFIG.baseUrl}/private-teacher/${teacherId}/availability`);}
requestSession(request:PrivateTeacherSessionRequest):Observable<ApiResponse<PrivateTeacherSession>>{return this.http.post<ApiResponse<PrivateTeacherSession>>(`${API_CONFIG.baseUrl}/private-teacher/sessions/request`,request);}
}