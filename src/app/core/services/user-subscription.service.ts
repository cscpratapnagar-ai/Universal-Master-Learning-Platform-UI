import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { UserSubscription } from '../models/user-subscription.model';

export interface BillingOrderSummary {
  id: string;
  userId: string;
  planId: string;
  billingCycle: string;
  amount: number;
  currency: string;
  status: string;
  externalOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingOrderResponse {
  orderId: string;
  planCode: string;
  planName: string;
  billingCycle: string;
  amount: number;
  currency: string;
  status: string;
  paymentProvider: string;
  gatewayOrderId: string;
  gatewayKeyId: string;
}

@Injectable({ providedIn: 'root' })
export class UserSubscriptionService {
  private readonly url = `${API_CONFIG.baseUrl}/student/subscription/me`;

  constructor(private readonly http: HttpClient) {}

  current(): Observable<ApiResponse<UserSubscription>> {
    return this.http.get<ApiResponse<UserSubscription>>(this.url);
  }

  createOrder(planCode: string, billingCycle: 'MONTHLY' | 'YEARLY'): Observable<ApiResponse<BillingOrderResponse>> {
    return this.http.post<ApiResponse<BillingOrderResponse>>(`${API_CONFIG.baseUrl}/student/billing/orders`, { planCode, billingCycle });
  }

  verifyPayment(orderId: string, payload: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${API_CONFIG.baseUrl}/student/billing/orders/${encodeURIComponent(orderId)}/verify`, payload);
  }

  orders(): Observable<ApiResponse<BillingOrderSummary[]>> {
    return this.http.get<ApiResponse<BillingOrderSummary[]>>(`${API_CONFIG.baseUrl}/student/billing/orders/history`);
  }
}
