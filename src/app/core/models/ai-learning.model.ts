export interface AiLearningOrchestration {
  enrollmentId: string;
  courseId: string;
  learnerState: string;
  recommendedAction: string;
  teachingStrategy: string;
  assessmentAction: string;
  priority: string;
  reasons: string[];
}

export interface PersonalizationOrchestration {
  enrollmentId: string;
  courseId: string;
  finalAction: string;
  priority: string;
  targetLessonId: string | null;
  targetLessonTitle: string | null;
  difficulty: string;
  pace: string;
  primaryGoal: string;
  rationale: string;
  signals: string[];
}

export interface DashboardIntelligence {
  ai: AiLearningOrchestration;
  personalization: PersonalizationOrchestration;
}
