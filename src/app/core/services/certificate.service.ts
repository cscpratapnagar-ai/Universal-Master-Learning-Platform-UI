import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private readonly base = `${API_CONFIG.baseUrl}/certificates`;

  constructor(private readonly http: HttpClient) {}

  verify(number: string) {
    return this.http.get<unknown>(`${this.base}/verify/${encodeURIComponent(number)}`);
  }

  issue(courseId: string, userId: string) {
    return this.http.post<unknown>(
      `${this.base}/courses/${encodeURIComponent(courseId)}/users/${encodeURIComponent(userId)}/issue`,
      {}
    );
  }
}
