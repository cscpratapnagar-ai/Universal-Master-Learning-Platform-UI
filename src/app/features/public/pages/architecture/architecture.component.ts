import { Component } from '@angular/core';

@Component({
  selector: 'app-architecture',
  templateUrl: './architecture.component.html',
  styleUrls: ['./architecture.component.scss']
})
export class ArchitectureComponent {
  lightMode = false;
  layers = [
    { icon: '◉', metric: '01', title: 'Learner Platform', text: 'Personalized dashboard, courses, progress, mastery, achievements and learning history.', tone: 'cyan' },
    { icon: '✦', metric: '02', title: 'Master Learning Engine', text: 'Progress, mastery, competency and learning intelligence shape the journey.', tone: 'violet' },
    { icon: '◇', metric: '03', title: 'Learning Path Engine', text: 'Prerequisites, dependency graphs, locked lessons and adaptive sequences.', tone: 'blue' },
    { icon: '◆', metric: '04', title: 'Assessment Engine', text: 'Quizzes, exams, attempts, scoring, passing criteria and mastery evidence.', tone: 'pink' },
    { icon: '▣', metric: '05', title: 'Curriculum Studio', text: 'Courses, modules, lessons, content types and publishing workflows.', tone: 'cyan' },
    { icon: '⌬', metric: '06', title: 'Assessment Studio', text: 'Questions, options, answers, points, passing scores and attempts.', tone: 'violet' },
    { icon: '⬡', metric: '07', title: 'Admin Platform', text: 'Learning, curriculum, assessments, paths, users, analytics and configuration.', tone: 'blue' },
    { icon: '★', metric: '08', title: 'Super Admin Platform', text: 'Global control, organizations, permissions, security and configuration.', tone: 'pink' },
    { icon: '◎', metric: '09', title: 'Organization Platform', text: 'Teachers, students, cohorts, courses, reports and settings.', tone: 'cyan' },
    { icon: '⌁', metric: '10', title: 'Security Layer', text: 'Authentication, authorization, RBAC, secure APIs, sessions and audit logs.', tone: 'violet' },
    { icon: '◌', metric: '11', title: 'Analytics & Intelligence', text: 'Performance, mastery trends, completion and predictive insights.', tone: 'blue' },
    { icon: '∞', metric: '12', title: 'Future Intelligence', text: 'AI assistant, adaptive learning, knowledge graph, skill mapping and intervention.', tone: 'pink' }
  ];
  metrics = [
    { value: '12', label: 'system layers', hint: 'connected by design' },
    { value: '360°', label: 'learning view', hint: 'progress to mastery' },
    { value: '∞', label: 'adaptive paths', hint: 'built for scale' }
  ];
  intelligence = [
    { key: '01', title: 'Progress', text: 'What is moving?' },
    { key: '02', title: 'Mastery', text: 'What is understood?' },
    { key: '03', title: 'Learning Path', text: 'What comes next?' },
    { key: '04', title: 'Adaptation', text: 'How should we respond?' }
  ];
  learnerFlow = ['Student', 'Course', 'Module', 'Lesson', 'Prerequisites', 'Assessment', 'Score', 'Mastery', 'Achievement'];
  creationFlow = ['Organization', 'Course', 'Modules', 'Lessons', 'Learning Path', 'Assessment', 'Publish', 'Learner'];
  toggleTheme(): void { this.lightMode = !this.lightMode; }
}
