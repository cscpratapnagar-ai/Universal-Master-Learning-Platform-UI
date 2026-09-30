import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AiTeacherGovernanceService } from '../../../../core/services/ai-teacher-governance.service';
import { AiTeacherGovernanceOverview } from '../../../../core/models/ai-teacher-governance.model';

@Component({
  selector: 'app-ai-teacher-governance',
  templateUrl: './ai-teacher-governance.component.html',
  styleUrls: ['./ai-teacher-governance.component.scss']
})
export class AiTeacherGovernanceComponent implements OnInit {
  overview: AiTeacherGovernanceOverview | null = null;
  loading = true;
  error = false;

  constructor(
    private readonly service: AiTeacherGovernanceService,
    private readonly router: Router
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = false;
    this.service.overview().subscribe({
      next: response => { this.overview = response.data; this.loading = false; },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  back(): void { this.router.navigateByUrl('/super-admin'); }
}
