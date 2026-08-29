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
  icon: string;
  value: string;
  label: string;
}

interface LandingFaq {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  theme: ThemeMode = 'dark';
  activeFaqIndex = -1;

  readonly statistics: LandingStatistic[] = [
    { icon: '◉', value: '10K+', label: 'Active Learners' },
    { icon: '♙', value: '500+', label: 'Expert Instructors' },
    { icon: '▣', value: '1,200+', label: 'Courses Available' },
    { icon: '◷', value: '25K+', label: 'Hours of Content' },
    { icon: '⌁', value: '95%', label: 'Satisfaction Rate' },
    { icon: '◉', value: '50+', label: 'Countries' }
  ];

  readonly features: LandingFeature[] = [
    {
      icon: '◆',
      title: 'Expert Courses',
      description: 'Learn from industry experts & educators'
    },
    {
      icon: '▮▮',
      title: 'Live Classes',
      description: 'Interactive live sessions with real-time Q&A'
    },
    {
      icon: '◉',
      title: 'AI Tutor',
      description: 'Get instant help anytime with AI'
    },
    {
      icon: '▣',
      title: 'Smart Assessments',
      description: 'AI-powered tests to track progress'
    },
    {
      icon: '⬡',
      title: 'Certificates',
      description: 'Earn recognized certificates'
    },
    {
      icon: '♧',
      title: 'Community',
      description: 'Connect, collaborate & grow together'
    }
  ];

  readonly faqs: LandingFaq[] = [
    {
      question: 'What is Universal Master Learning Platform?',
      answer:
        'A connected learning ecosystem for learners, educators and institutions.'
    },
    {
      question: 'Who can use the platform?',
      answer:
        'The experience scales from individual learners to institutions and organizations.'
    },
    {
      question: 'Does it include AI guidance?',
      answer:
        'Yes. AI guidance supports discovery, practice and personalized next steps.'
    }
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

  toggleFaq(index: number): void {
    this.activeFaqIndex =
      this.activeFaqIndex === index ? -1 : index;
  }

  isFaqOpen(index: number): boolean {
    return this.activeFaqIndex === index;
  }
}
