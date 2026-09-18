import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService, AssessmentView } from '../../../../core/services/assessment.service';

@Component({
  selector:'app-quiz',
  templateUrl:'./quiz.component.html',
  styleUrls:['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  assessmentId = '';
  enrollmentId = '';
  adaptiveMode = false;
  assessment?: AssessmentView;
  answers: Record<string,string> = {};
  submitting = false;
  loading = true;
  error = '';
  currentIndex = 0;

  constructor(private api: AssessmentService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.assessmentId = this.route.snapshot.queryParamMap.get('assessmentId') || this.route.snapshot.paramMap.get('assessmentId') || '';
    this.enrollmentId = this.route.snapshot.queryParamMap.get('enrollmentId') || '';
    this.adaptiveMode = this.route.snapshot.queryParamMap.get('mode') === 'adaptive';
    if (!this.assessmentId) { this.loading = false; this.error = 'No assessment was selected.'; return; }
    this.api.get(this.assessmentId).subscribe({
      next: r => { this.assessment = r.data; this.loading = false; },
      error: e => { this.loading = false; this.error = e?.error?.message || 'Unable to load this assessment.'; }
    });
  }

  get questions() { return this.assessment?.questions || []; }
  get unansweredCount(): number { return this.questions.filter(q => !this.answers[q.id]).length; }
  get answeredCount(): number { return this.questions.length - this.unansweredCount; }
  get progressPercent(): number { return this.questions.length ? Math.round(this.answeredCount / this.questions.length * 100) : 0; }
  get currentQuestion() { return this.questions[this.currentIndex]; }
  get isFirst(): boolean { return this.currentIndex === 0; }
  get isLast(): boolean { return this.currentIndex === this.questions.length - 1; }
  get attemptsExhausted(): boolean { return !!this.assessment && this.assessment.attemptsUsed >= this.assessment.maxAttempts; }
  get assessmentLocked(): boolean { return this.attemptsExhausted || !!this.assessment?.passed; }

  select(questionId:string, optionId:string): void {
    if (this.assessmentLocked) return;
    this.answers[questionId] = optionId;
  }

  goTo(index:number): void {
    if (index < 0 || index >= this.questions.length) return;
    this.currentIndex = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  previous(): void { this.goTo(this.currentIndex - 1); }
  next(): void { this.goTo(this.currentIndex + 1); }

  submit(): void {
    if (!this.assessment || this.assessmentLocked || this.unansweredCount > 0 || this.submitting) return;
    const assessmentId = this.assessment.id;
    this.submitting = true;
    this.api.submit(assessmentId, this.answers).subscribe({
      next:r=>{ this.submitting=false; this.router.navigateByUrl('/learner/assessment-result',{state:{result:r.data||r,assessmentId,enrollmentId:this.enrollmentId,adaptiveMode:this.adaptiveMode}}); },
      error:e=>{ this.submitting=false; this.error=e?.error?.message || 'Unable to submit assessment.'; }
    });
  }

  back(): void { this.router.navigateByUrl('/learner'); }
}
