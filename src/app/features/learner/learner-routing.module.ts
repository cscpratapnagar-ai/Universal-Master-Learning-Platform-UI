import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../core/guards/auth.guard';
import { LearnerDashboardComponent } from './pages/learner-dashboard/learner-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: LearnerDashboardComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnerRoutingModule {}
