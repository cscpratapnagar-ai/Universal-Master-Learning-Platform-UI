import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { UserSubscription } from '../models/user-subscription.model';

@Injectable({ providedIn: 'root' })
export class UserSubscriptionService {
  private readonly url = `${API_CONFIG.baseUrl}/student/subscription/me`;

  constructor(private readonly http: HttpClient) {}

  current(): Observable<ApiResponse<UserSubscription>> {
    return this.http.get<ApiResponse<UserSubscription>>(this.url);
  }
}
