import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { SuperAdminShellComponent } from './layout/super-admin-shell.component';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';
import { OrganizationManagementComponent } from './pages/organization-management/organization-management.component';

@NgModule({
  declarations: [SuperAdminShellComponent, SuperAdminDashboardComponent, OrganizationManagementComponent],
  imports: [CommonModule, FormsModule, RouterModule, SharedModule, SuperAdminRoutingModule]
})
export class SuperAdminModule {}