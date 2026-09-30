import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AcademyAssessmentService } from '../../../../core/services/academy-assessment.service';
import { AcademyAssessmentOverview } from '../../../../core/models/academy-assessment.model';

@Component({
  selector: 'app-assessment-management',
  templateUrl: './assessment-management.component.html',
  styleUrls: ['./assessment-management.component.scss']
})
export class AssessmentManagementComponent implements OnInit {
  overview: AcademyAssessmentOverview | null = null;
  loading = true;
  error = false;

  constructor(private readonly service: AcademyAssessmentService, private readonly router: Router) {}

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
  openAssessmentStudio(): void { this.router.navigateByUrl('/teacher/assessments'); }
}
