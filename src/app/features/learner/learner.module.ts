import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LearnerRoutingModule } from './learner-routing.module';
import { LearnerDashboardComponent } from './pages/learner-dashboard/learner-dashboard.component';

@NgModule({
  declarations: [LearnerDashboardComponent],
  imports: [SharedModule, LearnerRoutingModule]
})
export class LearnerModule {}
