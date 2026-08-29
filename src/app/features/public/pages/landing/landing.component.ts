import { AfterViewInit, Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  isMenuOpen = false;
  activeFaq = 0;
  theme: 'light' | 'dark' = 'dark';
  private observer?: IntersectionObserver;

  stats = [
    { value: '10M+', label: 'Learning moments' },
    { value: '190+', label: 'Countries connected' },
    { value: '99.9%', label: 'Platform availability' },
    { value: '24/7', label: 'AI learning support' }
  ];

  features = [
    { icon: '✦', title: 'Adaptive learning', text: 'Every journey evolves around the learner, not the other way around.' },
    { icon: '◈', title: 'Connected ecosystem', text: 'Students, educators and institutions work inside one intelligent universe.' },
    { icon: '◌', title: 'Actionable intelligence', text: 'Transform learning activity into meaningful next steps.' }
  ];

  faqs = [
    ['What is Universal Master Learning Platform?', 'A connected learning ecosystem designed to bring learners, educators and organizations together.'],
    ['Who can use the platform?', 'The experience is designed to scale from individual learners to institutions and multi-organization ecosystems.'],
    ['Will the platform support institutions?', 'Yes. Organization and multi-tenant capabilities are part of the platform foundation.']
  ];

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach(element => this.observer?.observe(element));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  toggleTheme(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleFaq(index: number): void {
    this.activeFaq = this.activeFaq === index ? -1 : index;
  }
}
