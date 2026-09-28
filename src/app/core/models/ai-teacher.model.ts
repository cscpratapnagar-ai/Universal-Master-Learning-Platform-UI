export interface AiTeacherTurnRequest {
  topic: string;
  subject?: string;
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


export interface AiTeacherQuotaResponse {
  plan: string;
  used: number;
  limit: number;
  remaining: number;
  periodStart: string;
}
