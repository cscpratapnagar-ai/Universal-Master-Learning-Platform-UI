import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';

export interface StudentCertificate {
  id: string;
  certificateNumber: string;
  courseId?: string;
}

@Injectable({ providedIn: 'root' })
export class CertificateService {
  private readonly base = API_CONFIG.baseUrl;

  constructor(private readonly http: HttpClient) {}

  mine() {
    return this.http.get<ApiResponse<StudentCertificate[]>>(`${this.base}/student/certificates`);
  }

  issue(courseId: string) {
    return this.http.post<ApiResponse<StudentCertificate>>(
      `${this.base}/student/certificates/courses/${encodeURIComponent(courseId)}/issue`,
      {}
    );
  }

  verify(number: string) {
    return this.http.get<ApiResponse<{ certificateNumber: string; valid: boolean }>>(
      `${this.base}/certificates/verify/${encodeURIComponent(number)}`
    );
  }
}
