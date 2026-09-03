import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { SuperAdminShellComponent } from './layout/super-admin-shell.component';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';
import { OrganizationManagementComponent } from './pages/organization-management/organization-management.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';

const routes: Routes = [
  {
    path: '',
    component: SuperAdminShellComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SUPER_ADMIN'] },
    children: [
      { path: '', component: SuperAdminDashboardComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'organizations', component: OrganizationManagementComponent },
      { path: 'learning', redirectTo: '/admin', pathMatch: 'full' }
    ]
  }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class SuperAdminRoutingModule {}