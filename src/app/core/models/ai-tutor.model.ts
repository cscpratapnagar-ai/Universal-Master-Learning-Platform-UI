export interface AiTutorSource { title?: string; lessonId?: string; relevance?: number; }
export interface AiTutorResponse { enrollmentId: string; response: string; grounded: boolean; llmUsed: boolean; sources: AiTutorSource[]; }
export interface AiTutorRequest { question: string; }
