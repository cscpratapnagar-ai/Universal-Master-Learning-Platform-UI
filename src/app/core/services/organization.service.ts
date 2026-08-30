import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { CreateOrganizationRequest, Organization, UpdateOrganizationRequest } from '../models/organization.model';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly url = `${API_CONFIG.baseUrl}/organizations`;
  constructor(private readonly http: HttpClient) {}
  getAll(): Observable<ApiResponse<Organization[]>> { return this.http.get<ApiResponse<Organization[]>>(this.url); }
  create(request: CreateOrganizationRequest): Observable<ApiResponse<Organization>> { return this.http.post<ApiResponse<Organization>>(this.url, request); }
  update(id: string, request: UpdateOrganizationRequest): Observable<ApiResponse<Organization>> { return this.http.put<ApiResponse<Organization>>(`${this.url}/${id}`, request); }
  deactivate(id: string): Observable<ApiResponse<void>> { return this.http.delete<ApiResponse<void>>(`${this.url}/${id}`); }
}