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
  enrollmentId = '';
  lessonId = '';
  adaptiveMode = false;

  constructor(private router: Router) {
    const state = history.state?.result as AssessmentResult | undefined;
    this.result = state || null;
    this.assessmentId = history.state?.assessmentId || state?.assessmentId || '';
    this.enrollmentId = history.state?.enrollmentId || '';
    this.lessonId = history.state?.lessonId || '';
    this.adaptiveMode = !!history.state?.adaptiveMode;
  }

  get score(): number { return Math.round(Number(this.result?.score ?? 0)); }
  get correct(): number { return Number(this.result?.correctAnswers ?? 0); }
  get total(): number { return Number(this.result?.totalQuestions ?? 0); }
  get accuracy(): number { return this.total ? Math.round(this.correct / this.total * 100) : 0; }
  get passed(): boolean { return !!this.result?.passed; }
  get masteryLevel(): string { return String(this.result?.masteryLevel || (this.score >= 90 ? 'MASTERED' : this.score >= 70 ? 'PROFICIENT' : this.score >= 50 ? 'DEVELOPING' : 'NEEDS_REVIEW')); }
  get masteryLabel(): string {
    return this.masteryLevel === 'MASTERED' ? 'Mastered' : this.masteryLevel === 'PROFICIENT' ? 'Proficient' : this.masteryLevel === 'DEVELOPING' ? 'Developing' : 'Needs review';
  }
  get masteryMessage(): string {
    return this.masteryLevel === 'MASTERED' ? 'You demonstrated a strong command of this learning objective.'
      : this.masteryLevel === 'PROFICIENT' ? 'Your understanding is solid. Keep applying the concept in new situations.'
      : this.masteryLevel === 'DEVELOPING' ? 'The foundation is forming. Focused practice will strengthen this concept.'
      : 'Review the key concepts and use targeted practice before trying again.';
  }
  get performanceLabel(): string {
    if (this.score >= 90) return 'Strong mastery signal';
    if (this.score >= 70) return 'Passing performance';
    if (this.score > 0) return 'Targeted practice recommended';
    return 'Learning checkpoint';
  }

  retry(): void {
    if (!this.assessmentId) return this.back();
    this.router.navigate(['/learner/quiz'], {
      queryParams: {
        assessmentId: this.assessmentId,
        mode: this.adaptiveMode ? 'adaptive' : undefined,
        enrollmentId: this.enrollmentId || undefined
      }
    });
  }

  back(): void {
    if (this.enrollmentId) {
      const queryParams = this.passed && this.lessonId ? { lessonId: this.lessonId } : undefined;
      this.router.navigate(['/learner/course', this.enrollmentId, 'learn'], queryParams ? { queryParams } : undefined);
      return;
    }
    this.router.navigateByUrl('/learner');
  }
  tutor(): void { this.router.navigateByUrl(this.enrollmentId ? `/learner/course/${this.enrollmentId}/ai-tutor` : '/learner'); }
}
