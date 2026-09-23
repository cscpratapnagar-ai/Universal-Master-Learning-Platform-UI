import { Component, OnInit } from '@angular/core';

interface FeatureCard { icon: string; title: string; description: string; tone: string; }
interface CourseCard { title: string; description: string; instructor: string; rating: string; students: string; level: string; image: string; tag: string; tagTone: string; duration: string; }
interface Story { name: string; role: string; quote: string; photo: string; }

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  isDark = false;
  mobileMenuOpen = false;
  themeTransitioning = false;

  readonly heroFeatures = [
    { icon: 'AI', label: 'AI Learning', tone: 'blue' },
    { icon: '★', label: 'Expert Mentors', tone: 'orange' },
    { icon: '⌘', label: 'Hands-on Projects', tone: 'green' },
    { icon: '✓', label: 'Get Certified', tone: 'purple' },
    { icon: '↗', label: 'Career Support', tone: 'pink' }
  ];

  readonly stats = [
    { icon: '♟', value: '100K+', label: 'Active Learners', tone: 'blue' },
    { icon: '♟', value: '500+', label: 'Expert Instructors', tone: 'orange' },
    { icon: '▣', value: '1,000+', label: 'Courses', tone: 'green' },
    { icon: '↗', value: '95%', label: 'Success Rate', tone: 'purple' },
    { icon: '◎', value: '50+', label: 'Countries', tone: 'blue' }
  ];

  readonly features: FeatureCard[] = [
    { icon: '◉', title: 'AI-Powered Learning', description: 'Personalized learning paths powered by advanced AI.', tone: 'blue' },
    { icon: '●', title: 'Learn from Experts', description: 'Industry professionals with real-world experience.', tone: 'orange' },
    { icon: '</>', title: 'Hands-on Projects', description: 'Build real-world projects and practical skills.', tone: 'green' },
    { icon: '✦', title: 'Globally Recognized', description: 'Earn certificates that showcase your skills worldwide.', tone: 'purple' }
  ];

  readonly categories = [
    { icon: '</>', name: 'Development', tone: 'blue' },
    { icon: '▥', name: 'Data Science', tone: 'blue' },
    { icon: '●', name: 'Design', tone: 'pink' },
    { icon: '▣', name: 'Business', tone: 'blue' },
    { icon: 'AI', name: 'AI & ML', tone: 'purple' },
    { icon: '◀', name: 'Marketing', tone: 'orange' },
    { icon: '◒', name: 'Personal Growth', tone: 'green' },
    { icon: '▭', name: 'IT & Software', tone: 'blue' },
    { icon: '•••', name: 'More', tone: 'blue' }
  ];

  readonly courses: CourseCard[] = [
    { title: 'Complete Web Development Bootcamp', description: 'HTML, CSS, JavaScript, React & More', instructor: 'John Carter', rating: '4.8', students: '12.5K', level: 'Beginner', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85', tag: 'Bestseller', tagTone: 'yellow', duration: '12h' },
    { title: 'AI & Machine Learning Mastery', description: 'From Basics to Advanced', instructor: 'Dr. Sarah Khan', rating: '4.7', students: '9.8K', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=85', tag: 'Hot', tagTone: 'red', duration: '15h' },
    { title: 'UI/UX Design — From Zero to Pro', description: 'Design Modern Digital Experiences', instructor: 'Alex Morgan', rating: '4.8', students: '7.1K', level: 'Beginner', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=85', tag: 'Trending', tagTone: 'purple', duration: '10h' },
    { title: 'Data Science with Python', description: 'Analyze Data, Build Models, Solve Real Problems', instructor: 'Emily Chen', rating: '4.9', students: '5.4K', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85', tag: 'New', tagTone: 'green', duration: '14h' }
  ];

  readonly studentPhotos = [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=90'
  ];

  readonly stories: Story[] = [
    { name: 'Rahul Mehta', role: 'Software Developer', quote: 'MLS gave me the skills and confidence to switch to a tech career. The learning experience is simply amazing!', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=180&q=80' },
    { name: 'Priya Shah', role: 'Data Analyst', quote: 'The instructors are top-notch and the hands-on projects helped me build a strong portfolio.', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=80' },
    { name: 'Daniel Kim', role: 'Product Designer', quote: 'Flexible learning, great content, and a supportive community. Highly recommended!', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=180&q=80' }
  ];

  ngOnInit(): void {
    try { this.isDark = localStorage.getItem('mls-theme') === 'dark'; } catch {}
  }

  toggleTheme(): void {
    this.themeTransitioning = true;
    this.isDark = !this.isDark;
    try { localStorage.setItem('mls-theme', this.isDark ? 'dark' : 'light'); } catch {}
    window.setTimeout(() => this.themeTransitioning = false, 650);
  }

  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; }
  scrollTo(id: string): void {
    this.mobileMenuOpen = false;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}