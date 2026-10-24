import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  message = '';

  constructor(
    private readonly certificatesApi: CertificateService,
    private readonly learning: LearningService,
    private readonly router: Router
  ) {}

  back(): void { this.router.navigateByUrl('/learner'); }

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
        this.error = 'Unable to load your certificates. You can retry or verify a certificate number below.';
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
    this.message = '';
    this.certificatesApi.issue(course.courseId).subscribe({
      next: response => {
        const certificate = response?.data;
        if (certificate) {
          this.certificates = [...this.certificates.filter(c => c.id !== certificate.id && c.courseId !== certificate.courseId), certificate];
          this.message = 'Certificate issued successfully and added to your credentials.';
        } else {
          this.error = 'The certificate service returned no certificate. Please refresh and try again.';
        }
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
