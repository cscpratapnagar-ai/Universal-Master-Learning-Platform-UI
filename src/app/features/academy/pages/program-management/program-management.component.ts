import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AcademyProgramService } from '../../../../core/services/academy-program.service';
import { AcademyProgramOverview } from '../../../../core/models/academy-program.model';

@Component({
  selector: 'app-program-management',
  templateUrl: './program-management.component.html',
  styleUrls: ['./program-management.component.scss']
})
export class ProgramManagementComponent implements OnInit {
  overview: AcademyProgramOverview | null = null;
  loading = true;
  error = false;

  constructor(private readonly service: AcademyProgramService, private readonly router: Router) {}

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
  openProgramWorkspace(): void { this.router.navigateByUrl('/admin/programs'); }
}
