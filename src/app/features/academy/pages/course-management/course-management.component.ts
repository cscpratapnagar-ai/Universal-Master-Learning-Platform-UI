import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AcademyCourseService } from '../../../../core/services/academy-course.service';
import { AcademyCourseOverview } from '../../../../core/models/academy-course.model';

@Component({
  selector: 'app-course-management',
  templateUrl: './course-management.component.html',
  styleUrls: ['./course-management.component.scss']
})
export class CourseManagementComponent implements OnInit {
  overview: AcademyCourseOverview | null = null;
  loading = true;
  error = false;

  constructor(private readonly service: AcademyCourseService, private readonly router: Router) {}

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
  openCourseStudio(): void { this.router.navigateByUrl('/teacher/courses'); }
}
