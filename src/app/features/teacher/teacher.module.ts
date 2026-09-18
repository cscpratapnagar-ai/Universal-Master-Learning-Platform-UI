import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherDashboardComponent } from './pages/teacher-dashboard/teacher-dashboard.component';

@NgModule({
  declarations: [TeacherDashboardComponent],
  imports: [SharedModule, TeacherRoutingModule]
})
export class TeacherModule {}
