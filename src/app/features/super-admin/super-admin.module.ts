import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';

@NgModule({
  declarations: [SuperAdminDashboardComponent],
  imports: [CommonModule, SharedModule, SuperAdminRoutingModule]
})
export class SuperAdminModule {}
