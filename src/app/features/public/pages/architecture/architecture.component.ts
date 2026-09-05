import { Component } from '@angular/core';

@Component({
  selector: 'app-architecture',
  templateUrl: './architecture.component.html',
  styleUrls: ['./architecture.component.scss']
})
export class ArchitectureComponent {
  layers = [
    { icon: '◉', title: 'Learner Platform', text: 'Courses, lessons, progress, mastery and achievement in one cinematic learning workspace.', tone: 'cyan' },
    { icon: '✦', title: 'Master Learning Engine', text: 'The core engine connecting learning activity, measurable mastery and adaptive next steps.', tone: 'violet' },
    { icon: '◇', title: 'Learning Path Engine', text: 'Prerequisites, sequencing, unlocked lessons and personalized learning journeys.', tone: 'blue' },
    { icon: '◆', title: 'Assessment Engine', text: 'Assessments, attempts, scoring, passing rules and evidence of learning.', tone: 'pink' },
    { icon: '▣', title: 'Curriculum Studio', text: 'Create and organize courses, modules, lessons and publishable learning content.', tone: 'cyan' },
    { icon: '⌬', title: 'Assessment Studio', text: 'Build lesson assessments and questions with a focused authoring workflow.', tone: 'violet' },
    { icon: '⬡', title: 'Admin Platform', text: 'Operate the learning ecosystem with curriculum, assessment and learning-path controls.', tone: 'blue' },
    { icon: '★', title: 'Super Admin', text: 'Global platform governance, security, configuration and system-level control.', tone: 'pink' },
    { icon: '◎', title: 'Organization Platform', text: 'A foundation for schools, institutes and organizations to manage their learning space.', tone: 'cyan' },
    { icon: '⌁', title: 'Security Layer', text: 'Authenticated, role-aware access with protected learner and administration flows.', tone: 'violet' },
    { icon: '◌', title: 'Analytics & Intelligence', text: 'Progress, mastery, learning signals and future intelligence capabilities.', tone: 'blue' },
    { icon: '∞', title: 'Advanced Future Layer', text: 'AI-assisted learning, projects, research, certificates and deeper personalization.', tone: 'pink' }
  ];

  intelligence = ['Progress', 'Mastery', 'Path', 'Adapt'];
}
