import { Component, OnInit } from '@angular/core';
import { CertificateService, StudentCertificate } from '../../../../core/services/certificate.service';
import { LearningService } from '../../../../core/services/learning.service';
import { StudentCourse } from '../../../../core/models/learning.model';

@Component({
  selector:'app-certificate',
  templateUrl:'./certificate.component.html',
  styleUrls:['./certificate.component.scss']
})
export class CertificateComponent implements OnInit {
  number = '';
  result: any;
  certificates: StudentCertificate[] = [];
  courses: StudentCourse[] = [];
  loading = false;
  issuingCourseId = '';
  error = '';

  constructor(
    private readonly certificatesApi: CertificateService,
    private readonly learning: LearningService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.certificatesApi.mine().subscribe({
      next: response => {
        this.certificates = response?.data || [];
        this.loadCourses();
      },
      error: () => {
        this.certificates = [];
        this.loadCourses();
      }
    });
  }

  private loadCourses(): void {
    this.learning.myCourses().subscribe({
      next: response => {
        this.courses = response?.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load your learning completion status.';
      }
    });
  }

  get completedCourses(): StudentCourse[] {
    return this.courses.filter(course => Number(course.progressPercent || 0) >= 100);
  }

  hasCertificate(course: StudentCourse): boolean {
    return this.certificates.some(c => !!c.certificateNumber && !!course.courseId && c.courseId === course.courseId);
  }

  issue(course: StudentCourse): void {
    if (!course.courseId || Number(course.progressPercent || 0) < 100 || this.issuingCourseId) return;
    this.issuingCourseId = course.courseId;
    this.error = '';
    this.certificatesApi.issue(course.courseId).subscribe({
      next: response => {
        const certificate = response?.data;
        if (certificate) this.certificates = [...this.certificates.filter(c => c.certificateNumber !== certificate.certificateNumber), certificate];
        this.issuingCourseId = '';
      },
      error: e => {
        this.issuingCourseId = '';
        this.error = e?.error?.message || 'Certificate could not be issued yet.';
      }
    });
  }

  verify(): void {
    if (!this.number.trim()) return;
    this.loading = true;
    this.result = null;
    this.certificatesApi.verify(this.number.trim()).subscribe({
      next: response => { this.result = response?.data ?? response; this.loading = false; },
      error: () => { this.result = { valid:false }; this.loading = false; }
    });
  }
}
