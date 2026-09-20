import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherDashboardComponent } from './pages/teacher-dashboard/teacher-dashboard.component';
import { TeacherCoursesComponent } from './pages/teacher-courses/teacher-courses.component';
import { TeacherAssessmentsComponent } from './pages/teacher-assessments/teacher-assessments.component';

@NgModule({
  declarations: [TeacherDashboardComponent, TeacherCoursesComponent, TeacherAssessmentsComponent],
  imports: [SharedModule, TeacherRoutingModule]
})
export class TeacherModule {}
