export interface PrivateTeacherOverview { eligibleTeachers:number; activePrivateTeachers:number; }
export interface PrivateTeacherAvailability { id:string; teacherId:string; dayOfWeek:string; startTime:string; endTime:string; timezone:string; active:boolean; }
export interface PrivateTeacherMatch { teacherId:string; teacherName:string; headline:string; subjects:string; languages:string; teachingModes:string; hourlyRate:number|null; currency:string; score:number; }
