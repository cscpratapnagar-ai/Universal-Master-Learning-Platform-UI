import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private readonly http: HttpClient) {}
  list(): Observable<ApiResponse<NotificationItem[]>> {
    return this.http.get<ApiResponse<NotificationItem[]>>(`${API_CONFIG.baseUrl}/student/notifications`);
  }
  unreadCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${API_CONFIG.baseUrl}/student/notifications/unread-count`);
  }
  markRead(id: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${API_CONFIG.baseUrl}/student/notifications/${id}/read`, {});
  }
  markAllRead(): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${API_CONFIG.baseUrl}/student/notifications/read-all`, {});
  }
}
