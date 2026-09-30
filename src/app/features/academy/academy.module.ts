import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AcademyRoutingModule } from './academy-routing.module';
import { AcademyDashboardComponent } from './pages/academy-dashboard/academy-dashboard.component';
import { TeacherManagementComponent } from './pages/teacher-management/teacher-management.component';

@NgModule({
  declarations: [AcademyDashboardComponent],
  imports: [SharedModule, AcademyRoutingModule]
})
export class AcademyModule {}
