import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { PlatformStatusService } from '../../../../core/services/platform-status.service';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';

interface FeatureCard { icon: string; title: string; description: string; badge?: string; }
interface StatCard { icon: string; value: string; label: string; }
interface Metric { value: string; label: string; }
interface JourneyCard { icon: string; number: string; title: string; description: string; points: string[]; action: string; }

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  theme: ThemeMode = 'dark';
  mobileMenuOpen = false;
  platformOnline = false;

  readonly metrics: Metric[] = [
    { value: '10K+', label: 'Active learners' },
    { value: '500+', label: 'Expert educators' },
    { value: '1,200+', label: 'Learning experiences' },
    { value: '95%', label: 'Learner satisfaction' }
  ];

  readonly journeys: JourneyCard[] = [
    { icon: '◉', number: '01', title: 'For Learners', description: 'A personal space that turns goals into a clear, measurable learning journey.', points: ['Courses & learning paths', 'Practice & assessments', 'Progress intelligence'], action: 'Start learning' },
    { icon: '✦', number: '02', title: 'For Educators', description: 'Design experiences, understand learner progress and create stronger learning outcomes.', points: ['Create & deliver courses', 'Live teaching tools', 'Actionable analytics'], action: 'Explore teaching' },
    { icon: '▦', number: '03', title: 'For Institutions', description: 'Bring people, programs and data together through one scalable education ecosystem.', points: ['Organization management', 'Role-based workspaces', 'Institutional insights'], action: 'Explore institutions' }
  ];

  readonly features: FeatureCard[] = [
    { icon: '◆', title: 'Expert Courses', description: 'Learn from experienced educators and industry experts.' },
    { icon: '▣', title: 'Live Classes', description: 'Interactive sessions with real-time collaboration and Q&A.' },
    { icon: '◉', title: 'AI Learning Guide', description: 'Context-aware support whenever you need clarity.' },
    { icon: '▤', title: 'Smart Assessments', description: 'Practice, evaluate and understand where to improve.' },
    { icon: '⬡', title: 'Certificates', description: 'Recognize meaningful learning milestones and achievements.' },
    { icon: '♧', title: 'Community', description: 'Connect, collaborate and grow with your learning network.' }
  ];

  readonly statistics: StatCard[] = [
    { icon: '♛', value: '10K+', label: 'Active Learners' },
    { icon: '♛', value: '500+', label: 'Expert Instructors' },
    { icon: '▤', value: '1,200+', label: 'Courses Available' },
    { icon: '◷', value: '25K+', label: 'Hours of Content' },
    { icon: '◉', value: '95%', label: 'Satisfaction Rate' },
    { icon: '◎', value: '50+', label: 'Countries' }
  ];

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly themeService: ThemeService,
    private readonly platformStatusService: PlatformStatusService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(this.themeService.theme$.subscribe((theme: ThemeMode) => this.theme = theme));
    this.subscriptions.add(this.platformStatusService.check().subscribe((online: boolean) => this.platformOnline = online));
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }
  toggleTheme(): void { this.themeService.toggle(); }
  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; }
  closeMobileMenu(): void { this.mobileMenuOpen = false; }

  scrollToSection(sectionId: string): void {
    this.closeMobileMenu();

    // Wait one frame so a closing mobile menu cannot change layout during measurement.
    requestAnimationFrame(() => {
      const target = document.getElementById(sectionId);
      if (!target) return;

      const headerOffset = 96;
      const rect = target.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      const viewport = window.innerHeight;
      const targetHeight = Math.min(target.offsetHeight, Math.max(0, viewport - headerOffset));

      // Short sections are centered in the viewport; large sections start cleanly below the nav.
      const centeredTop = absoluteTop - Math.max(
        headerOffset,
        (viewport - targetHeight) / 2
      );

      window.scrollTo({
        top: Math.max(0, centeredTop),
        behavior: 'smooth'
      });
    });
  }
}
