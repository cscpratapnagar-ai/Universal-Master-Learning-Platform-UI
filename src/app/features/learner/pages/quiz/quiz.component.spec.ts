import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AssessmentService, AssessmentView } from '../../../../core/services/assessment.service';
import { QuizComponent } from './quiz.component';

describe('QuizComponent', () => {
  let api: jasmine.SpyObj<AssessmentService>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  const assessment: AssessmentView = {
    id: 'assessment-1',
    title: 'Foundations',
    level: 'BEGINNER',
    passingScore: 70,
    maxAttempts: 3,
    attemptsUsed: 0,
    passed: false,
    questions: [
      { id: 'q1', questionText: 'Question 1', questionType: 'MCQ', points: 1, options: [{ id: 'o1', optionText: 'Option 1' }] },
      { id: 'q2', questionText: 'Question 2', questionType: 'MCQ', points: 1, options: [{ id: 'o2', optionText: 'Option 2' }] }
    ]
  };

  function setup(params: Record<string, string> = { assessmentId: 'assessment-1' }): QuizComponent {
    api = jasmine.createSpyObj<AssessmentService>('AssessmentService', ['get', 'submit']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate', 'navigateByUrl']);
    const paramMap = { get: (key: string) => params[key] ?? null };
    route = {
      snapshot: { queryParamMap: paramMap, paramMap }
    } as unknown as ActivatedRoute;
    api.get.and.returnValue(of({ data: assessment } as any));
    api.submit.and.returnValue(of({ data: { score: 100, passed: true } } as any));
    const component = new QuizComponent(api, route, router);
    component.ngOnInit();
    return component;
  }

  it('loads the selected assessment and tracks answer progress', () => {
    const component = setup();

    expect(api.get).toHaveBeenCalledWith('assessment-1');
    expect(component.loading).toBeFalse();
    expect(component.questions.length).toBe(2);
    expect(component.unansweredCount).toBe(2);
    component.select('q1', 'o1');
    expect(component.answeredCount).toBe(1);
    expect(component.progressPercent).toBe(50);
  });

  it('shows a useful error and skips the API when no assessment is selected', () => {
    const component = setup({});

    expect(component.loading).toBeFalse();
    expect(component.error).toBe('No assessment was selected.');
    expect(api.get).not.toHaveBeenCalled();
  });

  it('does not submit while questions remain unanswered', () => {
    const component = setup();
    component.select('q1', 'o1');

    component.submit();

    expect(api.submit).not.toHaveBeenCalled();
  });

  it('submits complete answers and navigates to the result page', () => {
    const component = setup();
    component.select('q1', 'o1');
    component.select('q2', 'o2');

    component.submit();

    expect(api.submit).toHaveBeenCalledWith('assessment-1', { q1: 'o1', q2: 'o2' });
    expect(component.submitting).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/learner/assessment-result', {
      state: jasmine.objectContaining({ assessmentId: 'assessment-1', result: { score: 100, passed: true } })
    });
  });

  it('releases submit state and shows an error when submission fails', () => {
    const component = setup();
    component.select('q1', 'o1');
    component.select('q2', 'o2');
    api.submit.and.returnValue(throwError(() => ({ error: { message: 'Submission rejected' } })));

    component.submit();

    expect(component.submitting).toBeFalse();
    expect(component.error).toBe('Submission rejected');
  });
});
