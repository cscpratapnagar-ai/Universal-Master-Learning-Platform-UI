import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { CreateOrganizationRequest, Organization, OrganizationCourse, OrganizationProgram, OrganizationOverview, OrganizationProfile, OrganizationProfileUpdate, OrganizationStatus, OrganizationMember, UpdateOrganizationRequest, OrganizationProjectDetail, OrganizationProjectMilestone, OrganizationProjectDependency, OrganizationProjectProgress, OrganizationProjectHealth } from '../models/organization.model';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly url = `${API_CONFIG.baseUrl}/organizations`;
  constructor(private readonly http: HttpClient) {}
  getMine(): Observable<ApiResponse<Organization[]>> { return this.http.get<ApiResponse<Organization[]>>(`${this.url}/me`); }
  getMyMemberships(): Observable<ApiResponse<OrganizationMember[]>> { return this.http.get<ApiResponse<OrganizationMember[]>>(`${this.url}/me/memberships`); }
  getAll(): Observable<ApiResponse<Organization[]>> { return this.http.get<ApiResponse<Organization[]>>(this.url); }
  create(request: CreateOrganizationRequest): Observable<ApiResponse<Organization>> { return this.http.post<ApiResponse<Organization>>(this.url, request); }
  update(id: string, request: UpdateOrganizationRequest): Observable<ApiResponse<Organization>> { return this.http.put<ApiResponse<Organization>>(`${this.url}/${id}`, request); }
  deactivate(id: string): Observable<ApiResponse<void>> { return this.http.delete<ApiResponse<void>>(`${this.url}/${id}`); }
  getOverview(id: string): Observable<ApiResponse<OrganizationOverview>> { return this.http.get<ApiResponse<OrganizationOverview>>(`${this.url}/${id}/overview`); }
  getCourses(id: string): Observable<ApiResponse<OrganizationCourse[]>> { return this.http.get<ApiResponse<OrganizationCourse[]>>(`${this.url}/${id}/courses`); }
  getPrograms(id: string): Observable<ApiResponse<OrganizationProgram[]>> { return this.http.get<ApiResponse<OrganizationProgram[]>>(`${API_CONFIG.baseUrl}/programs/organization/${id}`); }
  getProgramDetail(programId: string): Observable<ApiResponse<OrganizationProjectDetail>> { return this.http.get<ApiResponse<OrganizationProjectDetail>>(`${API_CONFIG.baseUrl}/programs/${programId}/detail`); }
  getProgramProgress(programId: string): Observable<ApiResponse<OrganizationProjectProgress>> { return this.http.get<ApiResponse<OrganizationProjectProgress>>(`${API_CONFIG.baseUrl}/programs/${programId}/progress`); }
  getProgramHealth(programId: string): Observable<ApiResponse<OrganizationProjectHealth>> { return this.http.get<ApiResponse<OrganizationProjectHealth>>(`${API_CONFIG.baseUrl}/programs/${programId}/health`); }
  getDependencies(programId: string): Observable<ApiResponse<OrganizationProjectDependency[]>> { return this.http.get<ApiResponse<OrganizationProjectDependency[]>>(`${API_CONFIG.baseUrl}/programs/${programId}/dependencies`); }
  createDependency(programId: string, body: { predecessorId: string; successorId: string }): Observable<ApiResponse<OrganizationProjectDependency>> { return this.http.post<ApiResponse<OrganizationProjectDependency>>(`${API_CONFIG.baseUrl}/programs/${programId}/dependencies`, body); }
  deleteDependency(id: string): Observable<ApiResponse<void>> { return this.http.delete<ApiResponse<void>>(`${API_CONFIG.baseUrl}/programs/dependencies/${id}`); }
  createMilestone(programId: string, body: { title: string; description?: string; dueDate?: string; sortOrder: number }): Observable<ApiResponse<OrganizationProjectMilestone>> { return this.http.post<ApiResponse<OrganizationProjectMilestone>>(`${API_CONFIG.baseUrl}/programs/${programId}/milestones`, body); }
  startMilestone(id: string): Observable<ApiResponse<OrganizationProjectMilestone>> { return this.http.put<ApiResponse<OrganizationProjectMilestone>>(`${API_CONFIG.baseUrl}/programs/milestones/${id}/start`, {}); }
  completeMilestone(id: string): Observable<ApiResponse<OrganizationProjectMilestone>> { return this.http.put<ApiResponse<OrganizationProjectMilestone>>(`${API_CONFIG.baseUrl}/programs/milestones/${id}/complete`, {}); }
  blockMilestone(id: string): Observable<ApiResponse<OrganizationProjectMilestone>> { return this.http.put<ApiResponse<OrganizationProjectMilestone>>(`${API_CONFIG.baseUrl}/programs/milestones/${id}/block`, {}); }
  reopenMilestone(id: string): Observable<ApiResponse<OrganizationProjectMilestone>> { return this.http.put<ApiResponse<OrganizationProjectMilestone>>(`${API_CONFIG.baseUrl}/programs/milestones/${id}/reopen`, {}); }
  cancelMilestone(id: string): Observable<ApiResponse<OrganizationProjectMilestone>> { return this.http.put<ApiResponse<OrganizationProjectMilestone>>(`${API_CONFIG.baseUrl}/programs/milestones/${id}/cancel`, {}); }
  deleteMilestone(id: string): Observable<ApiResponse<void>> { return this.http.delete<ApiResponse<void>>(`${API_CONFIG.baseUrl}/programs/milestones/${id}`); }
  startProgram(programId: string): Observable<ApiResponse<OrganizationProgram>> { return this.http.put<ApiResponse<OrganizationProgram>>(`${API_CONFIG.baseUrl}/programs/${programId}/start`, {}); }
  pauseProgram(programId: string): Observable<ApiResponse<OrganizationProgram>> { return this.http.put<ApiResponse<OrganizationProgram>>(`${API_CONFIG.baseUrl}/programs/${programId}/pause`, {}); }
  resumeProgram(programId: string): Observable<ApiResponse<OrganizationProgram>> { return this.http.put<ApiResponse<OrganizationProgram>>(`${API_CONFIG.baseUrl}/programs/${programId}/resume`, {}); }
  completeProgram(programId: string): Observable<ApiResponse<OrganizationProgram>> { return this.http.put<ApiResponse<OrganizationProgram>>(`${API_CONFIG.baseUrl}/programs/${programId}/complete`, {}); }
  archiveProgram(programId: string): Observable<ApiResponse<OrganizationProgram>> { return this.http.put<ApiResponse<OrganizationProgram>>(`${API_CONFIG.baseUrl}/programs/${programId}/archive`, {}); }
  publishCourse(courseId: string): Observable<ApiResponse<OrganizationCourse>> { return this.http.put<ApiResponse<OrganizationCourse>>(`${API_CONFIG.baseUrl}/courses/${courseId}/publish`, {}); }
  archiveCourse(courseId: string): Observable<ApiResponse<OrganizationCourse>> { return this.http.put<ApiResponse<OrganizationCourse>>(`${API_CONFIG.baseUrl}/courses/${courseId}/archive`, {}); }
  getProfile(id: string): Observable<ApiResponse<OrganizationProfile>> { return this.http.get<ApiResponse<OrganizationProfile>>(`${this.url}/${id}/profile`); }
  updateProfile(id: string, body: OrganizationProfileUpdate): Observable<ApiResponse<OrganizationProfile>> { return this.http.put<ApiResponse<OrganizationProfile>>(`${this.url}/${id}/profile`, body); }
  updateStatus(id: string, status: OrganizationStatus): Observable<ApiResponse<OrganizationProfile>> { return this.http.put<ApiResponse<OrganizationProfile>>(`${this.url}/${id}/status`, { status }); }
  getMembers(id: string): Observable<ApiResponse<OrganizationMember[]>> { return this.http.get<ApiResponse<OrganizationMember[]>>(`${this.url}/${id}/members`); }
  inviteMember(id: string, email: string): Observable<ApiResponse<void>> { return this.http.post<ApiResponse<void>>(`${this.url}/${id}/members/invite`, { email }); }
  deactivateMember(id: string, memberId: string): Observable<ApiResponse<void>> { return this.http.delete<ApiResponse<void>>(`${this.url}/${id}/members/${memberId}`); }
  activateMember(id: string, memberId: string): Observable<ApiResponse<void>> { return this.http.put<ApiResponse<void>>(`${this.url}/${id}/members/${memberId}/activate`, {}); }
}