import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LearningPathCourse, LearningPathLesson, LearningService } from '../../../../core/services/learning.service';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-learning-path',
  templateUrl: './learning-path.component.html',
  styleUrls: ['./learning-path.component.scss']
})
export class LearningPathComponent implements OnInit {
  theme: ThemeMode = 'dark';
  catalog: LearningPathCourse[] = [];
  courseId = '';
  moduleId = '';
  lessonId = '';
  prerequisites: LearningPathLesson[] = [];
  loading = true;
  saving = false;
  error = '';
  message = '';

  constructor(
    private readonly learning: LearningService,
    private readonly themeService: ThemeService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.theme = this.themeService.theme;
    this.themeService.theme$.subscribe(theme => this.theme = theme);
    this.loadCatalog();
  }

  get selectedCourse(): LearningPathCourse | undefined {
    return this.catalog.find(c => c.id === this.courseId);
  }

  get selectedModule() {
    return this.selectedCourse?.modules.find(m => m.id === this.moduleId);
  }

  get selectedLesson(): LearningPathLesson | undefined {
    return this.selectedModule?.lessons.find(l => l.id === this.lessonId);
  }

  get availablePrerequisites(): LearningPathLesson[] {
    if (!this.selectedLesson) return [];
    const existing = new Set(this.prerequisites.map(p => p.id));
    return (this.selectedCourse?.modules || [])
      .flatMap(m => m.lessons)
      .filter(l => l.id !== this.lessonId && !existing.has(l.id));
  }

  private loadCatalog(): void {
    this.learning.adminLearningCatalog().subscribe({
      next: response => {
        this.catalog = response.data || [];
        this.loading = false;
        if (this.catalog.length) {
          this.courseId = this.catalog[0].id;
          this.moduleId = this.catalog[0].modules[0]?.id || '';
          this.lessonId = this.catalog[0].modules[0]?.lessons[0]?.id || '';
          this.loadPrerequisites();
        }
      },
      error: error => {
        this.loading = false;
        this.error = error?.error?.message || 'Unable to load the learning catalog.';
      }
    });
  }

  courseChanged(): void {
    this.moduleId = this.selectedCourse?.modules[0]?.id || '';
    this.lessonId = this.selectedCourse?.modules[0]?.lessons[0]?.id || '';
    this.loadPrerequisites();
  }

  moduleChanged(): void {
    this.lessonId = this.selectedModule?.lessons[0]?.id || '';
    this.loadPrerequisites();
  }

  lessonChanged(): void {
    this.loadPrerequisites();
  }

  loadPrerequisites(): void {
    this.error = '';
    this.message = '';
    this.prerequisites = [];
    if (!this.lessonId) return;
    this.learning.getPrerequisites(this.lessonId).subscribe({
      next: response => this.prerequisites = response.data || [],
      error: error => this.error = error?.error?.message || 'Unable to load prerequisites.'
    });
  }

  addPrerequisite(lesson: LearningPathLesson): void {
    if (!this.lessonId || this.saving) return;
    this.saving = true;
    this.error = '';
    this.message = '';
    this.learning.addPrerequisite(this.lessonId, lesson.id).subscribe({
      next: response => {
        this.saving = false;
        this.prerequisites = [...this.prerequisites, response.data];
        this.message = 'Prerequisite added successfully.';
      },
      error: error => {
        this.saving = false;
        this.error = error?.error?.message || 'Could not add this prerequisite.';
      }
    });
  }

  removePrerequisite(lesson: LearningPathLesson): void {
    if (!this.lessonId || this.saving) return;
    this.saving = true;
    this.error = '';
    this.message = '';
    this.learning.removePrerequisite(this.lessonId, lesson.id).subscribe({
      next: () => {
        this.saving = false;
        this.prerequisites = this.prerequisites.filter(p => p.id !== lesson.id);
        this.message = 'Prerequisite removed.';
      },
      error: error => {
        this.saving = false;
        this.error = error?.error?.message || 'Could not remove this prerequisite.';
      }
    });
  }

  back(): void { this.router.navigateByUrl('/admin'); }
  toggleTheme(): void { this.themeService.toggle(); }
}
