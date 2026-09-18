import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface AssessmentResult {
  score?: number;
  passed?: boolean;
  correctAnswers?: number;
  totalQuestions?: number;
  passingScore?: number;
  assessmentId?: string;
  title?: string;
  nextAction?: string;
  masteryLevel?: string;
}

@Component({
  selector:'app-assessment-result',
  templateUrl:'./assessment-result.component.html',
  styleUrls:['./assessment-result.component.scss']
})
export class AssessmentResultComponent {
  result: AssessmentResult | null = null;
  assessmentId = '';

  constructor(private router: Router) {
    const state = history.state?.result as AssessmentResult | undefined;
    this.result = state || null;
    this.assessmentId = history.state?.assessmentId || state?.assessmentId || '';
  }

  get score(): number { return Math.round(Number(this.result?.score ?? 0)); }
  get correct(): number { return Number(this.result?.correctAnswers ?? 0); }
  get total(): number { return Number(this.result?.totalQuestions ?? 0); }
  get accuracy(): number { return this.total ? Math.round(this.correct / this.total * 100) : 0; }
  get passed(): boolean { return !!this.result?.passed; }
  get performanceLabel(): string {
    if (this.score >= 90) return 'Strong mastery signal';
    if (this.score >= 70) return 'Passing performance';
    if (this.score > 0) return 'Targeted practice recommended';
    return 'Learning checkpoint';
  }

  retry(): void {
    if (!this.assessmentId) return this.back();
    this.router.navigate(['/learner/quiz'], { queryParams: { assessmentId: this.assessmentId, mode: 'adaptive' } });
  }

  back(): void { this.router.navigateByUrl('/learner'); }
}
