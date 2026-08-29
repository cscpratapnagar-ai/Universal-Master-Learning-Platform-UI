import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  badge?: string;
}

interface StatCard {
  icon: string;
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

  readonly features: FeatureCard[] = [
    { icon: '◆', title: 'Expert Courses', description: 'Learn from industry experts & educators' },
    { icon: '▣', title: 'Live Classes', description: 'Interactive live sessions with real-time Q&A' },
    { icon: '◉', title: 'AI Tutor', description: 'Get instant help anytime, anywhere', badge: 'New' },
    { icon: '▤', title: 'Smart Assessments', description: 'AI-powered tests to track your progress' },
    { icon: '⬡', title: 'Certificates', description: 'Earn recognized certificates' },
    { icon: '♧', title: 'Community', description: 'Connect, collaborate & grow together' }
  ];

  readonly statistics: StatCard[] = [
    { icon: '♙', value: '10K+', label: 'Active Learners' },
    { icon: '♙', value: '500+', label: 'Expert Instructors' },
    { icon: '▤', value: '1,200+', label: 'Courses Available' },
    { icon: '◷', value: '25K+', label: 'Hours of Content' },
    { icon: '⌁', value: '95%', label: 'Satisfaction Rate' },
    { icon: '◉', value: '50+', label: 'Countries' }
  ];

  private themeSubscription?: Subscription;

  constructor(private readonly themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeSubscription = this.themeService.theme$.subscribe((theme: ThemeMode) => {
      this.theme = theme;
    });
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
