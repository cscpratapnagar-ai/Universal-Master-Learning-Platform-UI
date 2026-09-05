import { Component } from '@angular/core';

@Component({
  selector: 'app-architecture',
  templateUrl: './architecture.component.html',
  styleUrls: ['./architecture.component.scss']
})
export class ArchitectureComponent {
  lightMode = false;

  layers = [
    { icon: '◉', title: 'Learner Platform', text: 'Personalized dashboards, courses, progress, mastery, achievements and learning history.', tone: 'cyan', metric: '01' },
    { icon: '✦', title: 'Master Learning Engine', text: 'Progress intelligence, mastery scoring, recommendations and competency tracking.', tone: 'violet', metric: '02' },
    { icon: '◇', title: 'Learning Path Engine', text: 'Prerequisites, dependency graphs, sequencing, locked lessons and adaptive paths.', tone: 'blue', metric: '03' },
    { icon: '◆', title: 'Assessment Engine', text: 'Quizzes, exams, question banks, attempts, scoring and mastery evaluation.', tone: 'pink', metric: '04' },
    { icon: '▣', title: 'Curriculum Studio', text: 'Courses, modules, lessons, content types and controlled publishing workflows.', tone: 'cyan', metric: '05' },
    { icon: '⌬', title: 'Assessment Studio', text: 'Assessment builder, questions, options, points, passing scores and attempts.', tone: 'violet', metric: '06' },
    { icon: '⬡', title: 'Admin Platform', text: 'Dashboard, learning operations, curriculum, assessments, paths, users and analytics.', tone: 'blue', metric: '07' },
    { icon: '★', title: 'Super Admin Platform', text: 'Global platform control, organizations, administrators, permissions and security.', tone: 'pink', metric: '08' },
    { icon: '◎', title: 'Organization Platform', text: 'Organization dashboards, teachers, students, cohorts, reports and settings.', tone: 'cyan', metric: '09' },
    { icon: '⌁', title: 'Security Layer', text: 'Authentication, authorization, RBAC, secure APIs, sessions and audit logging.', tone: 'violet', metric: '10' },
    { icon: '◌', title: 'Analytics & Intelligence', text: 'Performance, mastery trends, completion rates, assessment insights and predictions.', tone: 'blue', metric: '11' },
    { icon: '∞', title: 'Future Intelligence Layer', text: 'AI learning assistant, adaptive learning, knowledge graphs and interventions.', tone: 'pink', metric: '12' }
  ];

  intelligence = [
    { title: 'Progress', text: 'Observe activity and completion signals' },
    { title: 'Mastery', text: 'Measure demonstrated understanding' },
    { title: 'Learning Path', text: 'Choose what should happen next' },
    { title: 'Adaptation', text: 'Continuously personalize the journey' }
  ];

  learnerFlow = ['Student', 'Course', 'Module', 'Lesson', 'Prerequisites', 'Assessment', 'Score', 'Mastery', 'Achievement'];
  creationFlow = ['Organization', 'Course', 'Modules', 'Lessons', 'Learning Path', 'Assessment', 'Publish', 'Learner'];

  toggleTheme(): void {
    this.lightMode = !this.lightMode;
  }
}
