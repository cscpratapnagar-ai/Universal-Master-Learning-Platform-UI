import { Router } from '@angular/router';
import { AssessmentResultComponent } from './assessment-result.component';
import { AssessmentService } from '../../../../core/services/assessment.service';
import { of } from 'rxjs';

describe('AssessmentResultComponent', () => {
  let router: jasmine.SpyObj<Router>;
  let assessmentService: jasmine.SpyObj<AssessmentService>;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['navigate', 'navigateByUrl']);
    assessmentService = jasmine.createSpyObj<AssessmentService>('AssessmentService', ['attemptHistory']);
    assessmentService.attemptHistory.and.returnValue(of({ success: true, message: 'ok', data: [], timestamp: '' }));
  });

  function createComponent(state: Record<string, unknown>): AssessmentResultComponent {
    spyOnProperty(window.history, 'state', 'get').and.returnValue(state);
    return new AssessmentResultComponent(router, assessmentService);
  }

  it('loads the signed-in learner assessment attempt history', () => {
    assessmentService.attemptHistory.and.returnValue(of({
      success: true,
      message: 'ok',
      data: [{ attemptId: 'attempt-1', attemptNumber: 2, score: 75, passed: true, masteryLevel: 'PROFICIENT', submittedAt: '2026-10-24T10:00:00Z' }],
      timestamp: ''
    }));

    const component = createComponent({ assessmentId: 'assessment-1', result: { score: 75, passed: true } });

    expect(assessmentService.attemptHistory).toHaveBeenCalledWith('assessment-1');
    expect(component.attemptHistory.length).toBe(1);
    expect(component.attemptHistory[0].attemptNumber).toBe(2);
  });

  it('calculates score and accuracy from the submitted result', () => {
    const component = createComponent({
      result: { score: 84.6, passed: true, correctAnswers: 17, totalQuestions: 20, masteryLevel: 'PROFICIENT' },
      assessmentId: 'assessment-1',
      enrollmentId: 'enrollment-1',
      lessonId: 'lesson-1'
    });

    expect(component.score).toBe(85);
    expect(component.accuracy).toBe(85);
    expect(component.passed).toBeTrue();
    expect(component.masteryLabel).toBe('Proficient');
  });

  it('shows no fabricated score when no result state is available', () => {
    const component = createComponent({});

    expect(component.result).toBeNull();
    expect(component.total).toBe(0);
    expect(component.accuracy).toBe(0);
  });

  it('returns an enrolled learner to the course learning page', () => {
    const component = createComponent({ enrollmentId: 'enrollment-1', lessonId: 'lesson-1', result: { passed: true } });

    component.back();

    expect(router.navigate).toHaveBeenCalledWith(
      ['/learner/course', 'enrollment-1', 'learn'],
      { queryParams: { lessonId: 'lesson-1' } }
    );
  });
  it('preserves assessment and lesson context when retrying a failed assessment', () => {
    const component = createComponent({
      result: { score: 45, passed: false },
      assessmentId: 'assessment-1',
      enrollmentId: 'enrollment-1',
      lessonId: 'lesson-1',
      adaptiveMode: true
    });

    component.retry();

    expect(router.navigate).toHaveBeenCalledWith(['/learner/quiz'], {
      queryParams: {
        assessmentId: 'assessment-1',
        mode: 'adaptive',
        enrollmentId: 'enrollment-1',
        lessonId: 'lesson-1'
      }
    });
  });

  it('returns to learning if no assessment id is available for retry', () => {
    const component = createComponent({
      result: { score: 45, passed: false },
      enrollmentId: 'enrollment-1'
    });

    component.retry();

    expect(router.navigate).toHaveBeenCalledWith(
      ['/learner/course', 'enrollment-1', 'learn'],
      undefined
    );
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

});
