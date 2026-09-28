import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningService } from '../../../../core/services/learning.service';
import { AiTeacherQuotaResponse, AiTeacherTurnResponse } from '../../../../core/models/ai-teacher.model';

interface TeacherPhase {
  key: string;
  label: string;
  icon: string;
}

interface TeachingSubject {
  key: string;
  label: string;
  icon: string;
  tone: string;
  defaultTopic: string;
}

interface TeachingMode {
  key: string;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-ai-teacher',
  templateUrl: './ai-teacher.component.html',
  styleUrls: ['./ai-teacher.component.scss']
})
export class AiTeacherComponent implements OnInit, OnDestroy {
  enrollmentId = '';
  topic = 'Projectile Motion';
  selectedSubject = 'PHYSICS';
  language: 'GU' | 'EN' = 'GU';
  phase = 'INTRO';
  lectureMinute = 0;
  studentMessage = '';
  response?: AiTeacherTurnResponse;
  quota?: AiTeacherQuotaResponse;
  loading = false;
  error = '';
  speaking = false;
  listening = false;
  private timer?: ReturnType<typeof setInterval>;

  readonly subjects: TeachingSubject[] = [
    { key: 'MATHEMATICS', label: 'Mathematics', icon: 'π', tone: 'blue', defaultTopic: 'Quadratic Equations' },
    { key: 'SCIENCE', label: 'Science', icon: '⚛', tone: 'cyan', defaultTopic: 'The Water Cycle' },
    { key: 'PHYSICS', label: 'Physics', icon: '◉', tone: 'violet', defaultTopic: 'Projectile Motion' },
    { key: 'CHEMISTRY', label: 'Chemistry', icon: '⚗', tone: 'pink', defaultTopic: 'Chemical Reactions' },
    { key: 'BIOLOGY', label: 'Biology', icon: '✿', tone: 'green', defaultTopic: 'Photosynthesis' },
    { key: 'SOCIAL_SCIENCE', label: 'Social Science', icon: '◎', tone: 'orange', defaultTopic: 'The Indian Constitution' },
    { key: 'ENGLISH', label: 'English', icon: 'Aa', tone: 'sky', defaultTopic: 'Narrative Writing' },
    { key: 'COMPUTER_SCIENCE', label: 'Computer Science', icon: '</>', tone: 'indigo', defaultTopic: 'Algorithms' }
  ];

  readonly teachingModes: TeachingMode[] = [
    { key: 'CONCEPT', label: 'Concept', icon: '◈', description: 'Simple step-by-step explanation' },
    { key: 'VISUAL', label: 'Animation & Visuals', icon: '✦', description: 'Diagrams and visual storytelling' },
    { key: 'REAL_LIFE', label: 'Real Life', icon: '⌂', description: 'Everyday examples and analogies' },
    { key: 'PRACTICE', label: 'Practice', icon: '✓', description: 'Guided practice with hints' },
    { key: 'DOUBT', label: 'Doubt Solver', icon: '?', description: 'Ask anything about the concept' },
    { key: 'RECAP', label: 'Summary & Notes', icon: '≡', description: 'Auto recap and study notes' }
  ];

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
    this.loadQuota();
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
        this.loadQuota();
        this.phase = result.data.nextPhase;
        this.studentMessage = '';
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.status === 429
          ? (this.language === 'GU' ? 'તમારો આ મહિનાનો AI Teacher quota પૂરો થયો છે. વધુ AI classes માટે plan upgrade કરો.' : 'Your AI Teacher monthly quota is used up. Upgrade your plan for more AI classes.')
          : 'AI Teacher could not continue the lecture right now.';
        this.loading = false;
      }
    });
  }

  loadQuota(): void {
    if (!this.enrollmentId) return;
    this.learning.aiTeacherQuota(this.enrollmentId).subscribe({
      next: result => this.quota = result.data,
      error: () => undefined
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

  selectSubject(subject: TeachingSubject): void {
    if (this.loading || subject.key === this.selectedSubject) return;
    this.selectedSubject = subject.key;
    this.topic = subject.defaultTopic;
    this.response = undefined;
    this.phase = 'INTRO';
    this.lectureMinute = 0;
    this.nextTurn();
  }

  selectMode(mode: TeachingMode): void {
    if (mode.key === 'DOUBT') {
      this.studentMessage = '';
      return;
    }
    if (mode.key === 'RECAP') {
      this.phase = 'RECAP';
      this.nextTurn();
      return;
    }
    this.phase = mode.key === 'REAL_LIFE' ? 'EXAMPLE' : mode.key === 'PRACTICE' ? 'PRACTICE' : 'EXPLAIN';
    this.nextTurn();
  }

  visualModeLabel(): string {
    const mode = (this.response?.visualMode || 'TEACHER_AVATAR').replace(/_/g, ' ');
    return mode.replace(/\\b\\w/g, value => value.toUpperCase());
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
