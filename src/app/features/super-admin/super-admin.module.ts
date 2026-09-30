import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { SuperAdminShellComponent } from './layout/super-admin-shell.component';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';
import { OrganizationManagementComponent } from './pages/organization-management/organization-management.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { RoleRequestsComponent } from './pages/role-requests/role-requests.component';
import { PlanManagementComponent } from './pages/plan-management/plan-management.component';
import { AiTeacherGovernanceComponent } from './pages/ai-teacher-governance/ai-teacher-governance.component';

@NgModule({
  declarations: [
    SuperAdminShellComponent,
    SuperAdminDashboardComponent,
    OrganizationManagementComponent,
    UserManagementComponent,
    RoleRequestsComponent,
    PlanManagementComponent,
    AiTeacherGovernanceComponent
  ],
  imports: [CommonModule, FormsModule, RouterModule, SharedModule, SuperAdminRoutingModule]
})
export class SuperAdminModule {}