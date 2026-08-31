import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { CreateOrganizationRequest, Organization, OrganizationProfile, OrganizationProfileUpdate, OrganizationStatus, UpdateOrganizationRequest } from '../models/organization.model';
@Injectable({providedIn:'root'}) export class OrganizationService {
 private readonly url=`${API_CONFIG.baseUrl}/organizations`; constructor(private readonly http:HttpClient){}
 getAll():Observable<ApiResponse<Organization[]>>{return this.http.get<ApiResponse<Organization[]>>(this.url);}
 create(r:CreateOrganizationRequest):Observable<ApiResponse<Organization>>{return this.http.post<ApiResponse<Organization>>(this.url,r);}
 update(id:string,r:UpdateOrganizationRequest):Observable<ApiResponse<Organization>>{return this.http.put<ApiResponse<Organization>>(`${this.url}/${id}`,r);}
 deactivate(id:string):Observable<ApiResponse<void>>{return this.http.delete<ApiResponse<void>>(`${this.url}/${id}`);}
 getProfile(id:string):Observable<ApiResponse<OrganizationProfile>>{return this.http.get<ApiResponse<OrganizationProfile>>(`${this.url}/${id}/profile`);}
 updateProfile(id:string,b:OrganizationProfileUpdate):Observable<ApiResponse<OrganizationProfile>>{return this.http.put<ApiResponse<OrganizationProfile>>(`${this.url}/${id}/profile`,b);}
 updateStatus(id:string,status:OrganizationStatus):Observable<ApiResponse<OrganizationProfile>>{return this.http.put<ApiResponse<OrganizationProfile>>(`${this.url}/${id}/status`,{status});}
}