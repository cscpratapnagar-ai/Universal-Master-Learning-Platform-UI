import { Component, OnInit } from '@angular/core';

interface FeatureCard { icon: string; title: string; description: string; tone: string; }
interface CourseCard { category: string; title: string; description: string; instructor: string; rating: string; students: string; level: string; tone: string; }

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  isDark = false;
  mobileMenuOpen = false;

  readonly features: FeatureCard[] = [
    { icon: 'AI', title: 'AI-Powered Learning', description: 'Personalized guidance that helps you understand what to learn and practice next.', tone: 'blue' },
    { icon: '★', title: 'Learn from Experts', description: 'Structured lessons and practical knowledge from experienced educators.', tone: 'orange' },
    { icon: '↗', title: 'Hands-on Projects', description: 'Build real projects, strengthen skills and learn by doing.', tone: 'green' },
    { icon: '✓', title: 'Recognized Certificates', description: 'Showcase meaningful achievements with professional certificates.', tone: 'gold' }
  ];

  readonly categories = [
    { icon: '</>', name: 'Development', tone: 'blue' },
    { icon: '◫', name: 'Data Science', tone: 'orange' },
    { icon: '●', name: 'Design', tone: 'gold' },
    { icon: '▣', name: 'Business', tone: 'green' },
    { icon: 'AI', name: 'AI & ML', tone: 'navy' },
    { icon: '↗', name: 'Marketing', tone: 'blue' },
    { icon: '✦', name: 'Personal Growth', tone: 'orange' },
    { icon: '+', name: 'More', tone: 'green' }
  ];

  readonly courses: CourseCard[] = [
    { category: 'Development', title: 'Complete Web Development Bootcamp', description: 'HTML, CSS, JavaScript, Angular, React & more', instructor: 'Expert Instructor', rating: '4.8', students: '12.5K', level: 'Beginner', tone: 'blue' },
    { category: 'AI & Machine Learning', title: 'AI & Machine Learning Mastery', description: 'From fundamentals to real-world intelligent systems', instructor: 'Dr. Sarah Khan', rating: '4.7', students: '9.8K', level: 'Intermediate', tone: 'navy' },
    { category: 'Design', title: 'UI/UX Design — From Zero to Pro', description: 'Design modern digital experiences users love', instructor: 'Alex Morgan', rating: '4.8', students: '7.1K', level: 'Beginner', tone: 'orange' },
    { category: 'Data Science', title: 'Data Science with Python', description: 'Analyze data, build models and solve real problems', instructor: 'Emily Chen', rating: '4.9', students: '5.4K', level: 'Intermediate', tone: 'green' }
  ];

  readonly studentPhotos = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=85',
    'https://images.unsplash.com/photo-1677594332295-affd04f83115?auto=format&fit=crop&w=900&q=85'
  ];

  ngOnInit(): void {
    try {
      this.isDark = localStorage.getItem('mls-theme') === 'dark';
    } catch {}
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    try { localStorage.setItem('mls-theme', this.isDark ? 'dark' : 'light'); } catch {}
  }

  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; }
  closeMobileMenu(): void { this.mobileMenuOpen = false; }

  scrollTo(id: string): void {
    this.closeMobileMenu();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
