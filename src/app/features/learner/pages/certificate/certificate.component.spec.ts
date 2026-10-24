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

  it('returns an invalid result when certificate verification fails', () => {
    const component = setup();
    component.number = 'CERT-MISSING';
    certificates.verify.and.returnValue(throwError(() => new Error('not found')) as any);

    component.verify();

    expect(component.result).toEqual({ valid: false });
    expect(component.loading).toBeFalse();
  });
});
