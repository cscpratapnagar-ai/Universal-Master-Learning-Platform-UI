import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AssessmentService } from '../../../../core/services/assessment.service';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../../../core/config/api.config';

interface LessonItem { id: string; title: string; completionMode: string; }
interface ModuleItem { id: string; title: string; lessons: LessonItem[]; }
interface CourseItem { id: string; title: string; status: string; modules: ModuleItem[]; }
interface DraftOption { text: string; correct: boolean; }
interface DraftQuestion { questionText: string; points: number; options: DraftOption[]; }

@Component({
  selector: 'app-assessment-builder',
  templateUrl: './assessment-builder.component.html',
  styleUrls: ['./assessment-builder.component.scss']
})
export class AssessmentBuilderComponent implements OnInit {
  theme: ThemeMode = 'dark';
  catalog: CourseItem[] = [];
  targetType: 'COURSE' | 'MODULE' | 'LESSON' = 'LESSON';
  courseId = '';
  moduleId = '';
  lessonId = '';
  title = '';
  passingScore = 60;
  maxAttempts = 3;
  creating = false;
  createdId = '';
  message = '';
  error = '';
  questions: DraftQuestion[] = [this.newQuestion()];

  constructor(
    private readonly http: HttpClient,
    private readonly api: AssessmentService,
    private readonly themeService: ThemeService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.theme = this.themeService.theme;
    this.themeService.theme$.subscribe(theme => this.theme = theme);
    this.http.get<{data: CourseItem[]}>(`${API_CONFIG.baseUrl}/admin/learning/catalog`).subscribe({
      next: response => {
        this.catalog = response.data || [];
        if (this.catalog.length) this.courseId = this.catalog[0].id;
      },
      error: () => this.error = 'Unable to load the learning catalog.'
    });
  }

  get selectedCourse(): CourseItem | undefined { return this.catalog.find(c => c.id === this.courseId); }
  get selectedModule(): ModuleItem | undefined { return this.selectedCourse?.modules.find(m => m.id === this.moduleId); }

  courseChanged(): void { this.moduleId = ''; this.lessonId = ''; }
  moduleChanged(): void { this.lessonId = ''; }

  addQuestion(): void { this.questions.push(this.newQuestion()); }
  removeQuestion(index: number): void { if (this.questions.length > 1) this.questions.splice(index, 1); }
  addOption(question: DraftQuestion): void { question.options.push({ text: '', correct: false }); }
  removeOption(question: DraftQuestion, index: number): void { if (question.options.length > 2) question.options.splice(index, 1); }
  setCorrect(question: DraftQuestion, index: number): void { question.options.forEach((option, i) => option.correct = i === index); }

  create(): void {
    this.message = ''; this.error = '';
    const targetId = this.targetType === 'COURSE' ? this.courseId : this.targetType === 'MODULE' ? this.moduleId : this.lessonId;
    if (!targetId || !this.title.trim()) { this.error = 'Select a target and enter an assessment title.'; return; }
    if (this.questions.some(q => !q.questionText.trim() || q.options.some(o => !o.text.trim()) || !q.options.some(o => o.correct))) {
      this.error = 'Every question needs text, two options and one correct answer.'; return;
    }

    this.creating = true;
    const payload = { title: this.title.trim(), passingScore: this.passingScore, maxAttempts: this.maxAttempts };
    const request = this.targetType === 'COURSE'
      ? this.api.createCourse(targetId, payload)
      : this.targetType === 'MODULE'
        ? this.api.createModule(targetId, payload)
        : this.api.createLesson(targetId, payload);

    request.subscribe({
      next: response => {
        this.createdId = String((response.data as any)?.id || '');
        this.createQuestions(0);
      },
      error: error => {
        this.creating = false;
        this.error = error?.error?.message || 'Assessment could not be created.';
      }
    });
  }

  private createQuestions(index: number): void {
    if (!this.createdId || index >= this.questions.length) {
      this.creating = false;
      this.message = 'Assessment and all questions are ready.';
      return;
    }
    const q = this.questions[index];
    this.api.createQuestion(this.createdId, {
      questionText: q.questionText.trim(), questionType: 'SINGLE_CHOICE', points: q.points,
      options: q.options.map(o => ({ text: o.text.trim(), correct: o.correct }))
    }).subscribe({
      next: () => this.createQuestions(index + 1),
      error: error => {
        this.creating = false;
        this.error = error?.error?.message || `Question ${index + 1} could not be saved.`;
      }
    });
  }

  back(): void { this.router.navigateByUrl('/admin'); }
  toggleTheme(): void { this.themeService.toggle(); }

  private newQuestion(): DraftQuestion {
    return { questionText: '', points: 10, options: [
      { text: '', correct: true }, { text: '', correct: false }, { text: '', correct: false }, { text: '', correct: false }
    ] };
  }
}
