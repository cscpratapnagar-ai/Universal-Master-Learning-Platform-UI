export interface PrivateTeacherOverview { eligibleTeachers:number; activePrivateTeachers:number; }
export interface PrivateTeacherAvailability { id:string; teacherId:string; dayOfWeek:string; startTime:string; endTime:string; timezone:string; active:boolean; }
export interface PrivateTeacherMatch { teacherId:string; teacherName:string; headline:string; subjects:string; languages:string; teachingModes:string; hourlyRate:number|null; currency:string; score:number; }
export interface PrivateTeacherSession { id:string; teacherId:string; learnerId:string; startsAt:string; endsAt:string; timezone:string; status:string; topic:string|null; notes:string|null; }
