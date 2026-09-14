import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningService } from '../../../../core/services/learning.service';
import { CourseLearning, Lesson } from '../../../../core/models/learning.model';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {
  data?: CourseLearning;
  enrollmentId = '';
  loading = true;
  error = '';
  theme: ThemeMode = 'dark';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly learning: LearningService,
    private readonly themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.enrollmentId = this.route.snapshot.paramMap.get('enrollmentId') || '';
    this.theme = this.themeService.theme;
    this.themeService.theme$.subscribe(theme => this.theme = theme);
    this.learning.courseLearning(this.enrollmentId).subscribe({
      next: response => { this.data = response.data; this.loading = false; },
      error: () => { this.error = 'Unable to load this course right now.'; this.loading = false; }
    });
  }

  get lessons(): Lesson[] { return this.data?.modules.flatMap(m => m.lessons) || []; }
  get completedLessons(): number { return this.lessons.filter(l => l.completed).length; }
  get totalLessons(): number { return this.lessons.length; }
  get nextLesson(): Lesson | undefined { return this.lessons.find(l => !l.completed && !l.locked) || this.lessons[0]; }
  get moduleCount(): number { return this.data?.modules.length || 0; }

  toggleTheme(): void { this.themeService.toggle(); }
  startLearning(): void { this.router.navigate(['/learner/course', this.enrollmentId, 'learn']); }
  back(): void { this.router.navigateByUrl('/learner/courses'); }
}
