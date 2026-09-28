export interface AiTeacherTurnRequest {
  topic: string;
  language: 'GU' | 'EN';
  phase: string;
  studentMessage?: string;
  lectureMinute?: number;
}

export interface AiTeacherTurnResponse {
  phase: string;
  teacherText: string;
  teachingMode: string;
  visualMode: string;
  nextPhase: string;
  askStudent: boolean;
  studentPrompt: string;
  lectureComplete: boolean;
}
