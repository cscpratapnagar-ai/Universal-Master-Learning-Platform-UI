import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { PlatformStatusService } from '../../../../core/services/platform-status.service';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';

interface Metric { value: string; label: string; }
interface Feature { icon: string; title: string; description: string; }

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

  readonly features: Feature[] = [
    { icon: '◎', title: 'Adaptive learning', description: 'A learning path that responds to your pace, strengths and goals.' },
    { icon: '✦', title: 'AI guidance', description: 'Ask, explore and understand with contextual help whenever you need it.' },
    { icon: '▦', title: 'Live experiences', description: 'Bring classrooms, workshops and communities into one connected space.' },
    { icon: '↗', title: 'Progress intelligence', description: 'Turn learning activity into clear insight and meaningful next actions.' },
    { icon: '✓', title: 'Smart assessment', description: 'Practice, feedback and evaluation designed for continuous improvement.' },
    { icon: '∞', title: 'One ecosystem', description: 'Students, educators and institutions connected without fragmented tools.' }
  ];

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly themeService: ThemeService,
    private readonly platformStatusService: PlatformStatusService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(this.themeService.theme$.subscribe(theme => this.theme = theme));
    this.subscriptions.add(this.platformStatusService.check().subscribe(online => this.platformOnline = online));
  }

  ngOnDestroy(): void { this.subscriptions.unsubscribe(); }
  toggleTheme(): void { this.themeService.toggle(); }
  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; }
  closeMobileMenu(): void { this.mobileMenuOpen = false; }
}