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
  assessment?: AssessmentView;
  answers: Record<string,string> = {};
  submitting = false;
  loading = true;
  error = '';

  constructor(private api: AssessmentService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.assessmentId = this.route.snapshot.queryParamMap.get('assessmentId') || this.route.snapshot.paramMap.get('assessmentId') || '';
    if (!this.assessmentId) { this.loading = false; this.error = 'No assessment was selected.'; return; }
    this.api.get(this.assessmentId).subscribe({
      next: r => { this.assessment = r.data; this.loading = false; },
      error: e => { this.loading = false; this.error = e?.error?.message || 'Unable to load this assessment.'; }
    });
  }

  select(questionId:string, optionId:string): void { this.answers[questionId] = optionId; }

  get unansweredCount(): number {
    return (this.assessment?.questions || []).filter(q => !this.answers[q.id]).length;
  }

  submit(): void {
    if (!this.assessment || this.unansweredCount > 0 || this.submitting) return;
    this.submitting = true;
    this.api.submit(this.assessment.id, this.answers).subscribe({
      next:r=>{ this.submitting=false; this.router.navigateByUrl('/learner/assessment-result',{state:{result:r.data||r}}); },
      error:e=>{ this.submitting=false; this.error=e?.error?.message || 'Unable to submit assessment.'; }
    });
  }
}
