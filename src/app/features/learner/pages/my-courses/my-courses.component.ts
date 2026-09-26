import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { LearningService } from '../../../../core/services/learning.service';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';
import { StudentCourse } from '../../../../core/models/learning.model';
import { AvailableCourse } from '../../../../core/services/learning.service';

@Component({ selector: 'app-my-courses', templateUrl: './my-courses.component.html', styleUrls: ['./my-courses.component.scss'] })
export class MyCoursesComponent implements OnInit {
  courses: StudentCourse[] = [];
  availableCourses: AvailableCourse[] = [];
  loading = true;
  catalogLoading = true;
  enrollingCourseId = '';
  catalogError = '';
  error = '';
  filter: 'all' | 'active' | 'completed' | 'not-started' = 'all';
  search = '';
  theme: ThemeMode = 'dark';

  constructor(private readonly auth: AuthService, private readonly learning: LearningService, private readonly router: Router, private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    if (!this.auth.currentUser()) { this.router.navigateByUrl('/auth/login'); return; }
    this.theme = this.themeService.theme;
    this.themeService.theme$.subscribe(theme => this.theme = theme);
    this.learning.myCourses().subscribe({
      next: response => { this.courses = response.data || []; this.loading = false; this.loadCatalog(); },
      error: () => { this.error = 'Unable to load your courses right now.'; this.loading = false; this.loadCatalog(); }
    });
  }

  get filteredCourses(): StudentCourse[] {
    const query = this.search.trim().toLowerCase();
    return this.courses.filter(course => {
      const progress = Number(course.progressPercent || 0);
      const matchesFilter = this.filter === 'all' || (this.filter === 'active' && progress > 0 && progress < 100) || (this.filter === 'completed' && progress >= 100) || (this.filter === 'not-started' && progress <= 0);
      const matchesSearch = !query || `${course.title} ${course.description || ''}`.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }
  loadCatalog(): void {
    this.catalogLoading = true;
    this.learning.availableCourses().subscribe({
      next: response => { this.availableCourses = (response.data || []).filter(c => !c.enrolled); this.catalogLoading = false; },
      error: () => { this.catalogError = 'Unable to load the course catalog.'; this.catalogLoading = false; }
    });
  }
  enroll(course: AvailableCourse): void {
    if (this.enrollingCourseId) return;
    this.enrollingCourseId = course.courseId;
    this.catalogError = '';
    this.learning.enrollCourse(course.courseId).subscribe({
      next: response => {
        this.enrollingCourseId = '';
        this.router.navigate(['/learner/course', response.data.id, 'learn']);
      },
      error: e => {
        this.enrollingCourseId = '';
        this.catalogError = e?.error?.message || 'Unable to enroll in this course.';
      }
    });
  }
  get activeCount(): number { return this.courses.filter(c => Number(c.progressPercent || 0) > 0 && Number(c.progressPercent || 0) < 100).length; }
  get completedCount(): number { return this.courses.filter(c => Number(c.progressPercent || 0) >= 100).length; }
  get notStartedCount(): number { return this.courses.filter(c => Number(c.progressPercent || 0) <= 0).length; }
  get averageProgress(): number { return this.courses.length ? Math.round(this.courses.reduce((sum, c) => sum + Number(c.progressPercent || 0), 0) / this.courses.length) : 0; }
  setFilter(filter: 'all' | 'active' | 'completed' | 'not-started'): void { this.filter = filter; }
  toggleTheme(): void { this.themeService.toggle(); }
  open(course: StudentCourse): void { this.router.navigate(['/learner/course', course.enrollmentId]); }
  back(): void { this.router.navigateByUrl('/learner'); }
}
