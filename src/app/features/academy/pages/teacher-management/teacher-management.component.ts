import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AcademyTeacherService } from '../../../../core/services/academy-teacher.service';
import { AcademyTeacherOverview } from '../../../../core/models/academy-teacher.model';

@Component({
  selector: 'app-teacher-management',
  templateUrl: './teacher-management.component.html',
  styleUrls: ['./teacher-management.component.scss']
})
export class TeacherManagementComponent implements OnInit {
  overview: AcademyTeacherOverview | null = null;
  loading = true;
  error = false;

  constructor(private readonly service: AcademyTeacherService, private readonly router: Router) {}

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
  openTeachingStudio(): void { this.router.navigateByUrl('/teacher'); }
}
