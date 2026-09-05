import { Component } from '@angular/core';

@Component({
  selector: 'app-architecture',
  templateUrl: './architecture.component.html',
  styleUrls: ['./architecture.component.scss']
})
export class ArchitectureComponent {
  lightMode = false;
  layers = [
    { icon: '◉', number: '01', title: 'Learner Platform', text: 'Personalized dashboard, courses, progress, mastery, achievements and learning history.', meta: 'Experience layer', tone: 'cyan' },
    { icon: '✦', number: '02', title: 'Master Learning Engine', text: 'Progress, mastery, competency and learning intelligence shape the journey.', meta: 'Core intelligence', tone: 'violet' },
    { icon: '◇', number: '03', title: 'Learning Path Engine', text: 'Prerequisites, dependency graphs, locked lessons and adaptive sequences.', meta: 'Path orchestration', tone: 'blue' },
    { icon: '◆', number: '04', title: 'Assessment Engine', text: 'Quizzes, exams, attempts, scoring, passing criteria and mastery evidence.', meta: 'Measurement', tone: 'pink' },
    { icon: '▣', number: '05', title: 'Curriculum Studio', text: 'Courses, modules, lessons, content types and publishing workflows.', meta: 'Authoring', tone: 'cyan' },
    { icon: '⌬', number: '06', title: 'Assessment Studio', text: 'Questions, options, answers, points, passing scores and attempts.', meta: 'Authoring', tone: 'violet' },
    { icon: '⬡', number: '07', title: 'Admin Platform', text: 'Learning, curriculum, assessments, paths, users, analytics and configuration.', meta: 'Operations', tone: 'blue' },
    { icon: '★', number: '08', title: 'Super Admin Platform', text: 'Global control, organizations, permissions, security and configuration.', meta: 'Governance', tone: 'pink' },
    { icon: '◎', number: '09', title: 'Organization Platform', text: 'Teachers, students, cohorts, courses, reports and settings.', meta: 'Multi-tenant', tone: 'cyan' },
    { icon: '⌁', number: '10', title: 'Security Layer', text: 'Authentication, authorization, RBAC, secure APIs, sessions and audit logs.', meta: 'Trust foundation', tone: 'violet' },
    { icon: '◌', number: '11', title: 'Analytics & Intelligence', text: 'Performance, mastery trends, completion and predictive insights.', meta: 'Decision layer', tone: 'blue' },
    { icon: '∞', number: '12', title: 'Future Intelligence', text: 'AI assistant, adaptive learning, knowledge graph, skill mapping and intervention.', meta: 'Next horizon', tone: 'pink' }
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
