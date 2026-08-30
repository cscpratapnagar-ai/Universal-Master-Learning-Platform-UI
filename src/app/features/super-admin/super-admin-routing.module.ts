import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';

const routes: Routes = [
  { path: '', component: SuperAdminDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule {}
