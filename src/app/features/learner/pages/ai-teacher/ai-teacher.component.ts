import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningService } from '../../../../core/services/learning.service';
import { AiTeacherTurnResponse } from '../../../../core/models/ai-teacher.model';

interface TeacherPhase {
  key: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-ai-teacher',
  templateUrl: './ai-teacher.component.html',
  styleUrls: ['./ai-teacher.component.scss']
})
export class AiTeacherComponent implements OnInit, OnDestroy {
  enrollmentId = '';
  topic = 'Projectile Motion';
  language: 'GU' | 'EN' = 'GU';
  phase = 'INTRO';
  lectureMinute = 0;
  studentMessage = '';
  response?: AiTeacherTurnResponse;
  loading = false;
  error = '';
  speaking = false;
  listening = false;
  private timer?: ReturnType<typeof setInterval>;

  readonly phases: TeacherPhase[] = [
    { key: 'INTRO', label: 'Introduction', icon: '01' },
    { key: 'EXPLAIN', label: 'Concept', icon: '02' },
    { key: 'EXAMPLE', label: 'Real Life', icon: '03' },
    { key: 'CHECK', label: 'Understanding', icon: '04' },
    { key: 'PRACTICE', label: 'Practice', icon: '05' },
    { key: 'RECAP', label: 'Recap', icon: '06' }
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly learning: LearningService
  ) {}

  ngOnInit(): void {
    this.enrollmentId = this.route.snapshot.paramMap.get('enrollmentId') || '';
    if (!this.enrollmentId) {
      this.error = 'A course enrollment is required.';
      return;
    }
    this.startClock();
    this.nextTurn();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  nextTurn(): void {
    if (this.loading || this.phase === 'COMPLETE') return;
    this.loading = true;
    this.error = '';

    this.learning.aiTeacherTurn(this.enrollmentId, {
      topic: this.topic,
      language: this.language,
      phase: this.phase,
      studentMessage: this.studentMessage.trim() || undefined,
      lectureMinute: this.lectureMinute
    }).subscribe({
      next: result => {
        this.response = result.data;
        this.phase = result.data.nextPhase;
        this.studentMessage = '';
        this.loading = false;
      },
      error: () => {
        this.error = 'AI Teacher could not continue the lecture right now.';
        this.loading = false;
      }
    });
  }

  ask(): void {
    if (!this.studentMessage.trim() || this.loading) return;
    this.nextTurn();
  }

  startListening(): void {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.error = this.language === 'GU' ? 'આ browserમાં voice input support નથી.' : 'Voice input is not supported in this browser.';
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = this.language === 'GU' ? 'gu-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    this.listening = true;
    this.error = '';

    recognition.onresult = (event: any) => {
      this.studentMessage = event.results?.[0]?.[0]?.transcript || '';
    };
    recognition.onerror = () => {
      this.error = this.language === 'GU' ? 'Voice input capture થઈ શક્યું નથી.' : 'Voice input could not be captured.';
    };
    recognition.onend = () => this.listening = false;
    recognition.start();
  }

  speak(): void {
    if (!this.response?.teacherText || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(this.response.teacherText);
    utterance.lang = this.language === 'GU' ? 'gu-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onstart = () => this.speaking = true;
    utterance.onend = () => this.speaking = false;
    window.speechSynthesis.speak(utterance);
  }

  setLanguage(language: 'GU' | 'EN'): void {
    this.language = language;
    this.response = undefined;
    this.phase = 'INTRO';
    this.nextTurn();
  }

  back(): void {
    this.router.navigate(['/learner/course', this.enrollmentId, 'progress']);
  }

  private startClock(): void {
    this.timer = setInterval(() => this.lectureMinute++, 60000);
  }

  get phaseIndex(): number {
    const current = this.phases.findIndex(p => p.key === (this.response?.phase || 'INTRO'));
    return current < 0 ? 0 : current;
  }

  get currentPhaseLabel(): string {
    return this.phases.find(p => p.key === (this.response?.phase || 'INTRO'))?.label || 'Live Lecture';
  }
}
