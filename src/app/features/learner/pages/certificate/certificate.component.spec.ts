import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CertificateService } from '../../../../core/services/certificate.service';
import { LearningService } from '../../../../core/services/learning.service';
import { CertificateComponent } from './certificate.component';

describe('CertificateComponent', () => {
  let certificates: jasmine.SpyObj<CertificateService>;
  let learning: jasmine.SpyObj<LearningService>;
  let router: jasmine.SpyObj<Router>;

  function setup(): CertificateComponent {
    certificates = jasmine.createSpyObj<CertificateService>('CertificateService', ['mine', 'issue', 'verify']);
    learning = jasmine.createSpyObj<LearningService>('LearningService', ['myCourses']);
    router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    return new CertificateComponent(certificates, learning, router);
  }

  it('shows a certificate retrieval error while still loading course completion status', () => {
    const component = setup();
    certificates.mine.and.returnValue(throwError(() => new Error('network down')) as any);
    learning.myCourses.and.returnValue(of({ data: [{ courseId: 'course-1', progressPercent: 100 }] } as any));

    component.load();

    expect(component.certificates).toEqual([]);
    expect(component.courses.length).toBe(1);
    expect(component.error).toContain('Unable to load your certificates');
    expect(component.loading).toBeFalse();
  });

  it('only lists courses at 100 percent as certificate-ready', () => {
    const component = setup();
    component.courses = [
      { courseId: 'course-1', progressPercent: 100, title: 'Complete course' },
      { courseId: 'course-2', progressPercent: 99, title: 'Almost complete' },
      { courseId: 'course-3', progressPercent: 0, title: 'Not started' }
    ] as any;

    expect(component.completedCourses.map(course => course.courseId)).toEqual(['course-1']);
  });

  it('recognizes a certificate already issued for the course', () => {
    const component = setup();
    component.certificates = [{ id: 'cert-1', certificateNumber: 'CERT-001', courseId: 'course-1' }];

    expect(component.hasCertificate({ courseId: 'course-1', progressPercent: 100 } as any)).toBeTrue();
    expect(component.hasCertificate({ courseId: 'course-2', progressPercent: 100 } as any)).toBeFalse();
  });

  it('releases the issuing state and shows an error when issuance fails', () => {
    const component = setup();
    certificates.issue.and.returnValue(throwError(() => ({ error: { message: 'Course completion not confirmed' } })) as any);

    component.issue({ courseId: 'course-1', progressPercent: 100 } as any);

    expect(component.issuingCourseId).toBe('');
    expect(component.error).toBe('Course completion not confirmed');
  });

  it('does not request a certificate for an incomplete course', () => {
    const component = setup();

    component.issue({ courseId: 'course-1', progressPercent: 99 } as any);

    expect(certificates.issue).not.toHaveBeenCalled();
    expect(component.issuingCourseId).toBe('');
  });

  it('verifies a trimmed certificate number and exposes the API result', () => {
    const component = setup();
    component.number = '  CERT-001  ';
    certificates.verify.and.returnValue(of({ data: { valid: true } } as any));

    component.verify();

    expect(certificates.verify).toHaveBeenCalledWith('CERT-001');
    expect(component.result).toEqual({ valid: true });
    expect(component.loading).toBeFalse();
  });

  it('shows a learning status error when course retrieval fails', () => {
    const component = setup();
    certificates.mine.and.returnValue(of({ data: [] } as any));
    learning.myCourses.and.returnValue(throwError(() => new Error('service unavailable')) as any);

    component.load();

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('Unable to load your learning completion status.');
  });

  it('adds an issued certificate and clears the issuing state', () => {
    const component = setup();
    const issued = { id: 'cert-1', certificateNumber: 'CERT-001', courseId: 'course-1' };
    certificates.issue.and.returnValue(of({ data: issued } as any));

    component.issue({ courseId: 'course-1', progressPercent: 100 } as any);

    expect(certificates.issue).toHaveBeenCalledWith('course-1');
    expect(component.certificates).toContain(issued);
    expect(component.issuingCourseId).toBe('');
  });

  it('replaces any existing course certificate and confirms successful issuance', () => {
    const component = setup();
    const existing = { id: 'old-cert', certificateNumber: 'CERT-OLD', courseId: 'course-1' };
    const issued = { id: 'new-cert', certificateNumber: 'CERT-NEW', courseId: 'course-1' };
    component.certificates = [existing];
    certificates.issue.and.returnValue(of({ data: issued } as any));

    component.issue({ courseId: 'course-1', progressPercent: 100 } as any);

    expect(component.certificates).toEqual([issued]);
    expect(component.message).toContain('Certificate issued successfully');
    expect(component.issuingCourseId).toBe('');
  });

  it('shows a useful message when issuance returns no certificate', () => {
    const component = setup();
    certificates.issue.and.returnValue(of({ data: null } as any));

    component.issue({ courseId: 'course-1', progressPercent: 100 } as any);

    expect(component.error).toContain('returned no certificate');
    expect(component.issuingCourseId).toBe('');
  });

  it('does not call verification when the certificate number is blank', () => {
    const component = setup();
    component.number = '   ';

    component.verify();

    expect(certificates.verify).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('returns an invalid result when certificate verification fails', () => {
    const component = setup();
    component.number = 'CERT-MISSING';
    certificates.verify.and.returnValue(throwError(() => new Error('not found')) as any);

    component.verify();

    expect(component.result).toEqual({ valid: false });
    expect(component.loading).toBeFalse();
  });
});
