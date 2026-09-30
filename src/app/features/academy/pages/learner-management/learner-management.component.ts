import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AcademyLearnerService } from '../../../../core/services/academy-learner.service';
import { AcademyLearnerOverview } from '../../../../core/models/academy-learner.model';

@Component({
  selector: 'app-learner-management',
  templateUrl: './learner-management.component.html',
  styleUrls: ['./learner-management.component.scss']
})
export class LearnerManagementComponent implements OnInit {
  overview: AcademyLearnerOverview | null = null;
  loading = true;
  error = false;

  constructor(private readonly service: AcademyLearnerService, private readonly router: Router) {}

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
  openLearnerPortal(): void { this.router.navigateByUrl('/learner'); }
}
