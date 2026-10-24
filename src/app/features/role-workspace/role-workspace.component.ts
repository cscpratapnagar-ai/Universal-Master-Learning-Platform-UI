import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { EvaluatorService, EvaluatorAssignment, EvaluatorAttempt, EvaluatorAttemptDetail } from '../../core/services/evaluator.service';

@Component({
  selector: 'app-role-workspace',
  templateUrl: './role-workspace.component.html',
  styleUrls: ['./role-workspace.component.scss']
})
export class RoleWorkspaceComponent implements OnInit {
  title = 'Workspace';
  description = 'Your account has been assigned a platform role.';
  roleLabel = '';
  userEmail = '';
  isEvaluator = false;
  assignments: EvaluatorAssignment[] = [];
  attempts: EvaluatorAttempt[] = [];
  selectedAssessmentId = '';
  selectedAttemptId = '';
  detail: EvaluatorAttemptDetail | null = null;
  remarks = '';
  loading = false;
  saving = false;
  error = '';
  notice = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly evaluatorService: EvaluatorService
  ) {}

  ngOnInit(): void {
    this.title = this.route.snapshot.data['title'] || this.title;
    this.description = this.route.snapshot.data['description'] || this.description;
    this.roleLabel = this.route.snapshot.data['role'] || '';
    this.userEmail = this.authService.currentUser()?.email || '';
    this.isEvaluator = this.roleLabel === 'EVALUATOR';
    if (this.isEvaluator) this.loadAssignments();
  }

  loadAssignments(): void {
    this.loading = true;
    this.error = '';
    this.evaluatorService.myAssignments().subscribe({
      next: response => {
        this.assignments = response.data || [];
        this.loading = false;
      },
      error: () => { this.error = 'Could not load assignments. Please refresh or sign in again.'; this.loading = false; }
    });
  }

  selectAssessment(assessmentId: string): void {
    this.selectedAssessmentId = assessmentId;
    this.selectedAttemptId = '';
    this.detail = null;
    this.remarks = '';
    this.notice = '';
    this.loading = true;
    this.error = '';
    this.evaluatorService.attempts(assessmentId).subscribe({
      next: response => { this.attempts = response.data || []; this.loading = false; },
      error: () => { this.error = 'Could not load submitted attempts for this assessment.'; this.loading = false; }
    });
  }

  selectAttempt(attemptId: string): void {
    if (!this.selectedAssessmentId) return;
    this.selectedAttemptId = attemptId;
    this.detail = null;
    this.remarks = '';
    this.notice = '';
    this.loading = true;
    this.error = '';
    this.evaluatorService.attemptDetail(this.selectedAssessmentId, attemptId).subscribe({
      next: response => {
        this.detail = response.data;
        this.loading = false;
        this.evaluatorService.getReview(this.selectedAssessmentId, attemptId).subscribe({
          next: review => this.remarks = review.data?.remarks || '',
          error: () => this.remarks = ''
        });
      },
      error: () => { this.error = 'Could not load this attempt.'; this.loading = false; }
    });
  }

  saveFeedback(): void {
    if (!this.selectedAssessmentId || !this.selectedAttemptId || !this.remarks.trim()) return;
    this.saving = true;
    this.error = '';
    this.notice = '';
    this.evaluatorService.saveReview(this.selectedAssessmentId, this.selectedAttemptId, this.remarks.trim()).subscribe({
      next: response => {
        this.remarks = response.data?.remarks || this.remarks.trim();
        this.notice = 'Feedback saved. The automatic assessment score was not changed.';
        this.saving = false;
      },
      error: () => { this.error = 'Feedback could not be saved. Check your assignment and try again.'; this.saving = false; }
    });
  }
}
