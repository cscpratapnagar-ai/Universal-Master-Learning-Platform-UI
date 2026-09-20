import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherDashboardComponent } from './pages/teacher-dashboard/teacher-dashboard.component';
import { TeacherCoursesComponent } from './pages/teacher-courses/teacher-courses.component';

@NgModule({
  declarations: [TeacherDashboardComponent, TeacherCoursesComponent],
  imports: [SharedModule, TeacherRoutingModule]
})
export class TeacherModule {}
