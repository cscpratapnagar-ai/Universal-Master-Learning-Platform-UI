import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { CreateOrganizationRequest, Organization, OrganizationCourse, OrganizationOverview, OrganizationProfile, OrganizationProfileUpdate, OrganizationStatus, OrganizationMember, UpdateOrganizationRequest } from '../models/organization.model';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly url = `${API_CONFIG.baseUrl}/organizations`;
  constructor(private readonly http: HttpClient) {}
  getMine(): Observable<ApiResponse<Organization[]>> { return this.http.get<ApiResponse<Organization[]>>(`${this.url}/me`); }
  getAll(): Observable<ApiResponse<Organization[]>> { return this.http.get<ApiResponse<Organization[]>>(this.url); }
  create(request: CreateOrganizationRequest): Observable<ApiResponse<Organization>> { return this.http.post<ApiResponse<Organization>>(this.url, request); }
  update(id: string, request: UpdateOrganizationRequest): Observable<ApiResponse<Organization>> { return this.http.put<ApiResponse<Organization>>(`${this.url}/${id}`, request); }
  deactivate(id: string): Observable<ApiResponse<void>> { return this.http.delete<ApiResponse<void>>(`${this.url}/${id}`); }
  getOverview(id: string): Observable<ApiResponse<OrganizationOverview>> { return this.http.get<ApiResponse<OrganizationOverview>>(`${this.url}/${id}/overview`); }
  getCourses(id: string): Observable<ApiResponse<OrganizationCourse[]>> { return this.http.get<ApiResponse<OrganizationCourse[]>>(`${this.url}/${id}/courses`); }
  getProfile(id: string): Observable<ApiResponse<OrganizationProfile>> { return this.http.get<ApiResponse<OrganizationProfile>>(`${this.url}/${id}/profile`); }
  updateProfile(id: string, body: OrganizationProfileUpdate): Observable<ApiResponse<OrganizationProfile>> { return this.http.put<ApiResponse<OrganizationProfile>>(`${this.url}/${id}/profile`, body); }
  updateStatus(id: string, status: OrganizationStatus): Observable<ApiResponse<OrganizationProfile>> { return this.http.put<ApiResponse<OrganizationProfile>>(`${this.url}/${id}/status`, { status }); }
  getMembers(id: string): Observable<ApiResponse<OrganizationMember[]>> { return this.http.get<ApiResponse<OrganizationMember[]>>(`${this.url}/${id}/members`); }
  inviteMember(id: string, email: string): Observable<ApiResponse<void>> { return this.http.post<ApiResponse<void>>(`${this.url}/${id}/members/invite`, { email }); }
  deactivateMember(id: string, memberId: string): Observable<ApiResponse<void>> { return this.http.delete<ApiResponse<void>>(`${this.url}/${id}/members/${memberId}`); }
}