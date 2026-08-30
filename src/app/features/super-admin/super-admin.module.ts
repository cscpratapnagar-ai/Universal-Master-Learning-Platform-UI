import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';
import { OrganizationManagementComponent } from './pages/organization-management/organization-management.component';

@NgModule({
  declarations: [SuperAdminDashboardComponent, OrganizationManagementComponent],
  imports: [CommonModule, FormsModule, SharedModule, SuperAdminRoutingModule]
})
export class SuperAdminModule {}
