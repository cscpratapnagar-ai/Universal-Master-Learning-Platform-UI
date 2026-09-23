import { Component } from '@angular/core';

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  tone: string;
}

interface CourseCard {
  category: string;
  title: string;
  description: string;
  instructor: string;
  rating: string;
  students: string;
  level: string;
  color: string;
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
  initials: string;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  mobileMenuOpen = false;

  readonly features: FeatureCard[] = [
    { icon: 'AI', title: 'AI-Powered Learning', description: 'Personalized guidance that helps every learner understand what to learn next.', tone: 'red' },
    { icon: '★', title: 'Learn from Experts', description: 'Structured lessons and practical knowledge from experienced educators.', tone: 'orange' },
    { icon: '↗', title: 'Hands-on Projects', description: 'Build real projects, practice your skills and learn by doing.', tone: 'yellow' },
    { icon: '✓', title: 'Recognized Certificates', description: 'Showcase meaningful achievements with professional certificates.', tone: 'green' }
  ];

  readonly categories = [
    { icon: '</>', name: 'Development', tone: 'red' },
    { icon: '◫', name: 'Data Science', tone: 'orange' },
    { icon: '●', name: 'Design', tone: 'yellow' },
    { icon: '▣', name: 'Business', tone: 'green' },
    { icon: 'AI', name: 'AI & ML', tone: 'blue' },
    { icon: '↗', name: 'Marketing', tone: 'indigo' },
    { icon: '✦', name: 'Personal Growth', tone: 'violet' },
    { icon: '+', name: 'More', tone: 'rainbow' }
  ];

  readonly courses: CourseCard[] = [
    {
      category: 'Development',
      title: 'Complete Web Development Bootcamp',
      description: 'HTML, CSS, JavaScript, Angular, React & more',
      instructor: 'John Carter',
      rating: '4.8',
      students: '12.5K',
      level: 'Beginner',
      color: 'blue'
    },
    {
      category: 'AI & Machine Learning',
      title: 'AI & Machine Learning Mastery',
      description: 'From fundamentals to real-world intelligent systems',
      instructor: 'Dr. Sarah Khan',
      rating: '4.7',
      students: '9.8K',
      level: 'Intermediate',
      color: 'violet'
    },
    {
      category: 'Design',
      title: 'UI/UX Design — From Zero to Pro',
      description: 'Design modern digital experiences users love',
      instructor: 'Alex Morgan',
      rating: '4.8',
      students: '7.1K',
      level: 'Beginner',
      color: 'orange'
    },
    {
      category: 'Data Science',
      title: 'Data Science with Python',
      description: 'Analyze data, build models and solve real problems',
      instructor: 'Emily Chen',
      rating: '4.9',
      students: '5.4K',
      level: 'Intermediate',
      color: 'green'
    }
  ];

  readonly testimonials: Testimonial[] = [
    { name: 'Rahul Mehta', role: 'Software Developer', initials: 'RM', text: 'MLS helped me build the skills and confidence I needed for my next career step.', },
    { name: 'Priya Shah', role: 'Data Analyst', initials: 'PS', text: 'The courses are clear, practical and easy to follow. I can learn at my own pace.', },
    { name: 'Daniel Kim', role: 'Product Designer', initials: 'DK', text: 'A clean learning experience with useful projects and a strong community.', }
  ];

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  scrollTo(id: string): void {
    this.closeMobileMenu();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
