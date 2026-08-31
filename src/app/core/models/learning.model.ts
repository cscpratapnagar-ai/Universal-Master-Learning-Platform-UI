export interface ApiResponse<T>{success:boolean;message:string;data:T;}
export interface StudentCourse{enrollmentId:string;courseId:string;title:string;description:string;status:string;progressPercent:number;}
export interface Lesson{id:string;title:string;contentType:string;content:string;sortOrder:number;completed:boolean;}
export interface CourseModule{id:string;title:string;sortOrder:number;lessons:Lesson[];}
export interface CourseLearning{courseId:string;title:string;description:string;progressPercent:number;modules:CourseModule[];}