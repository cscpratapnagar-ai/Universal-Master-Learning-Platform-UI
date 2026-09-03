import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AssessmentBuilderComponent } from './pages/assessment-builder/assessment-builder.component';
import { LearningPathComponent } from './pages/learning-path/learning-path.component';

@NgModule({
  declarations: [AdminDashboardComponent, AssessmentBuilderComponent, LearningPathComponent],
  imports: [SharedModule, AdminRoutingModule]
})
export class AdminModule {}
