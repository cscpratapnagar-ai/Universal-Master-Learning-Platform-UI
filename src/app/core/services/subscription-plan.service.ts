import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { SubscriptionPlan } from '../models/subscription-plan.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionPlanService {
  private readonly url = `${API_CONFIG.baseUrl}/public/subscription-plans`;

  constructor(private readonly http: HttpClient) {}

  getPlans(): Observable<ApiResponse<SubscriptionPlan[]>> {
    return this.http.get<ApiResponse<SubscriptionPlan[]>>(this.url);
  }

  getAdminPlans(): Observable<ApiResponse<SubscriptionPlan[]>> {
    return this.http.get<ApiResponse<SubscriptionPlan[]>>(`${API_CONFIG.baseUrl}/super-admin/subscription-plans`);
  }

  updateAdminPlan(code: string, plan: SubscriptionPlan): Observable<ApiResponse<SubscriptionPlan>> {
    return this.http.put<ApiResponse<SubscriptionPlan>>(
      `${API_CONFIG.baseUrl}/super-admin/subscription-plans/${encodeURIComponent(code)}`,
      plan
    );
  }
}
