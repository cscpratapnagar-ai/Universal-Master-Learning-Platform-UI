import { Component, OnInit } from '@angular/core';
import { LearningPathCourse, LearningPathLesson, LearningPathModule, LearningService } from '../../../../core/services/learning.service';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.scss']
})
export class CurriculumComponent implements OnInit {
  courses: LearningPathCourse[] = [];
  selectedCourse?: LearningPathCourse;
  selectedModule?: LearningPathModule;
  selectedLesson?: LearningPathLesson;
  loading = true;
  saving = false;
  error = '';
  success = '';
  theme: 'light' | 'dark' = 'dark';

  newModuleTitle = '';
  newLessonTitle = '';
  newLessonContent = '';
  newLessonType = 'TEXT';
  newLessonCompletionMode = 'MANUAL_COMPLETE';

  constructor(private readonly learning: LearningService) {}

  ngOnInit(): void {
    this.loadCatalog();
  }

  loadCatalog(preferredCourseId?: string, preferredModuleId?: string): void {
    this.loading = true;
    this.error = '';
    this.learning.adminLearningCatalog().subscribe({
      next: response => {
        this.courses = response.data || [];
        const course = this.courses.find(item => item.id === (preferredCourseId || this.selectedCourse?.id)) || this.courses[0];
        this.selectCourse(course, preferredModuleId);
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Unable to load the curriculum catalog.';
      }
    });
  }

  selectCourse(course?: LearningPathCourse, preferredModuleId?: string): void {
    this.selectedCourse = course;
    this.selectedModule = course?.modules.find(item => item.id === preferredModuleId) || course?.modules[0];
    this.selectedLesson = this.selectedModule?.lessons[0];
    this.clearMessages();
  }

  selectModule(module: LearningPathModule): void {
    this.selectedModule = module;
    this.selectedLesson = module.lessons[0];
    this.clearMessages();
  }

  selectLesson(lesson: LearningPathLesson): void {
    this.selectedLesson = lesson;
    this.clearMessages();
  }

  createModule(): void {
    const title = this.newModuleTitle.trim();
    if (!this.selectedCourse || !title || this.saving) return;

    this.saving = true;
    this.clearMessages();
    this.learning.createModule(this.selectedCourse.id, {
      title,
      sortOrder: this.selectedCourse.modules.length
    }).subscribe({
      next: () => {
        this.success = 'Module created successfully.';
        this.newModuleTitle = '';
        this.saving = false;
        this.loadCatalog(this.selectedCourse?.id);
      },
      error: err => {
        this.saving = false;
        this.error = err?.error?.message || 'Unable to create the module.';
      }
    });
  }

  createLesson(): void {
    const title = this.newLessonTitle.trim();
    if (!this.selectedModule || !title || this.saving) return;

    this.saving = true;
    this.clearMessages();
    this.learning.createLesson(this.selectedModule.id, {
      title,
      contentType: this.newLessonType,
      content: this.newLessonContent.trim(),
      sortOrder: this.selectedModule.lessons.length
    }).subscribe({
      next: created => {
        this.learning.updateLessonCompletionMode(created.data.id, this.newLessonCompletionMode).subscribe({
          next: () => this.finishLessonCreation('Lesson created successfully.'),
          error: err => this.finishLessonCreation(err?.error?.message || 'Lesson created, but completion mode could not be updated.')
        });
      },
      error: err => {
        this.saving = false;
        this.error = err?.error?.message || 'Unable to create the lesson.';
      }
    });
  }

  private finishLessonCreation(message: string): void {
    this.success = message;
    this.newLessonTitle = '';
    this.newLessonContent = '';
    this.saving = false;
    this.loadCatalog(this.selectedCourse?.id, this.selectedModule?.id);
  }

  lessonCount(course: LearningPathCourse): number {
    return course.modules.reduce((total, module) => total + module.lessons.length, 0);
  }

  clearMessages(): void {
    this.error = '';
    this.success = '';
  }

  toggleTheme(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
  }
}
