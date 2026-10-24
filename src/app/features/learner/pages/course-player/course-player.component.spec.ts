import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LearningService } from '../../../../core/services/learning.service';
import { AssessmentService, AssessmentView } from '../../../../core/services/assessment.service';
import { CertificateService } from '../../../../core/services/certificate.service';
import { CoursePlayerComponent } from './course-player.component';

describe('CoursePlayerComponent assessment loading', () => {
  let learning: jasmine.SpyObj<LearningService>;
  let assessments: jasmine.SpyObj<AssessmentService>;
  let certificates: jasmine.SpyObj<CertificateService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  const assessment: AssessmentView = {
    id: 'assessment-1',
    title: 'Lesson check',
    level: 'BEGINNER',
    passingScore: 70,
    maxAttempts: 3,
    attemptsUsed: 0,
    passed: false,
    questions: []
  };

  function setup(): CoursePlayerComponent {
    learning = jasmine.createSpyObj<LearningService>('LearningService', ['courseLearning', 'completeLesson', 'respondToAiTutor']);
    assessments = jasmine.createSpyObj<AssessmentService>('AssessmentService', ['forLesson']);
    certificates = jasmine.createSpyObj<CertificateService>('CertificateService', ['mine', 'issue']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate', 'navigateByUrl']);
    const paramMap = { get: (key: string) => key === 'enrollmentId' ? 'enrollment-1' : null };
    route = { snapshot: { paramMap, queryParamMap: paramMap } } as unknown as ActivatedRoute;
    const component = new CoursePlayerComponent(route, learning, assessments, certificates, router);
    component.enrollmentId = 'enrollment-1';
    return component;
  }

  it('shows a useful message when the lesson assessment cannot be loaded', () => {
    const component = setup();
    component.selected = { id: 'lesson-1', title: 'Lesson 1', contentType: 'TEXT', content: '', sortOrder: 1, completed: false };
    assessments.forLesson.and.returnValue(throwError(() => ({ error: { message: 'Assessment service unavailable' } })) as any);

    component.loadAssessment();

    expect(component.assessmentLoading).toBeFalse();
    expect(component.assessmentError).toBe('Assessment service unavailable');
    expect(component.assessment).toBeUndefined();
  });

  it('clears the previous assessment error when retrying and loads the assessment', () => {
    const component = setup();
    component.selected = { id: 'lesson-1', title: 'Lesson 1', contentType: 'TEXT', content: '', sortOrder: 1, completed: false };
    assessments.forLesson.and.returnValues(
      throwError(() => ({ error: { message: 'Temporary failure' } })) as any,
      of({ data: [assessment] } as any)
    );

    component.loadAssessment();
    expect(component.assessmentError).toBe('Temporary failure');

    component.loadAssessment();

    expect(assessments.forLesson).toHaveBeenCalledTimes(2);
    expect(component.assessmentError).toBe('');
    expect(component.assessment?.id).toBe('assessment-1');
    expect(component.assessmentLoading).toBeFalse();
  });
  it('refreshes course progress after a lesson is completed', () => {
    const component = setup();
    const lesson = { id: 'lesson-1', title: 'Lesson 1', contentType: 'TEXT', content: '', sortOrder: 1, completed: false, locked: false, completionMode: 'MANUAL', unmetPrerequisiteLessonIds: [] };
    component.selected = lesson as any;
    learning.completeLesson.and.returnValue(of({}) as any);
    learning.courseLearning.and.returnValue(of({ data: { courseId: 'course-1', progressPercent: 50, modules: [{ id: 'module-1', title: 'Module 1', lessons: [{ ...lesson, completed: true }] }] } } as any));
    assessments.forLesson.and.returnValue(of({ data: [] } as any));

    component.complete();

    expect(learning.completeLesson).toHaveBeenCalledWith('enrollment-1', 'lesson-1');
    expect(learning.courseLearning).toHaveBeenCalledWith('enrollment-1');
    expect(component.completing).toBeFalse();
    expect(component.data?.progressPercent).toBe(50);
    expect(component.selected?.completed).toBeTrue();
  });

  it('keeps the lesson incomplete and shows an error when completion fails', () => {
    const component = setup();
    component.selected = { id: 'lesson-2', title: 'Lesson 2', contentType: 'TEXT', content: '', sortOrder: 2, completed: false, locked: false, completionMode: 'MANUAL', unmetPrerequisiteLessonIds: [] } as any;
    learning.completeLesson.and.returnValue(throwError(() => ({ error: { message: 'Prerequisite is not complete' } })) as any);

    component.complete();

    expect(component.completing).toBeFalse();
    expect(component.error).toBe('Prerequisite is not complete');
    expect(component.selected?.completed).toBeFalse();
    expect(learning.courseLearning).not.toHaveBeenCalled();
  });

});
