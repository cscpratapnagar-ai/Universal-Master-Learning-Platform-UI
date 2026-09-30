import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AcademyQuestionBankService } from '../../../../core/services/academy-question-bank.service';
import { AcademyQuestionBankOverview } from '../../../../core/models/academy-question-bank.model';

@Component({
  selector: 'app-question-bank-management',
  templateUrl: './question-bank-management.component.html',
  styleUrls: ['./question-bank-management.component.scss']
})
export class QuestionBankManagementComponent implements OnInit {
  overview: AcademyQuestionBankOverview | null = null;
  loading = true;
  error = false;

  constructor(private readonly service: AcademyQuestionBankService, private readonly router: Router) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = false;
    this.service.overview().subscribe({
      next: response => { this.overview = response.data; this.loading = false; },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  back(): void { this.router.navigateByUrl('/academy'); }
  openQuestionBank(): void { this.router.navigateByUrl('/teacher/question-bank'); }
}
