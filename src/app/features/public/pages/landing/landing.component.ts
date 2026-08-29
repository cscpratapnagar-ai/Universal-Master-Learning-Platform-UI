import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  ThemeMode,
  ThemeService
} from '../../../../core/services/theme.service';

interface LandingFeature {
  icon: string;
  title: string;
  description: string;
}

interface LandingStatistic {
  value: string;
  label: string;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  theme: ThemeMode = 'dark';
  mobileMenuOpen = false;

  readonly features: LandingFeature[] = [
    {
      icon: '✦',
      title: 'Adaptive Learning',
      description: 'AI continuously adapts your next learning step.'
    },
    {
      icon: '◉',
      title: 'Live Intelligence',
      description: 'Understand progress while learning happens.'
    },
    {
      icon: '↗',
      title: 'Measurable Growth',
      description: 'Turn every learning signal into momentum.'
    }
  ];

  readonly statistics: LandingStatistic[] = [
    { value: '10K+', label: 'Active learners' },
    { value: '500+', label: 'Expert educators' },
    { value: '1,200+', label: 'Learning paths' },
    { value: '50+', label: 'Countries connected' }
  ];

  private themeSubscription?: Subscription;

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeSubscription = this.themeService.theme$.subscribe(
      (theme: ThemeMode) => {
        this.theme = theme;
      }
    );
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
