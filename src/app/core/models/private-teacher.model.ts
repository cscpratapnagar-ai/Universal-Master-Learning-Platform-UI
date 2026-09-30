export interface PrivateTeacherOverview {
  eligibleTeachers: number;
  activePrivateTeachers: number;
}

export interface PrivateTeacherAvailability {
  id: string;
  teacherId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  timezone: string;
  active: boolean;
}
