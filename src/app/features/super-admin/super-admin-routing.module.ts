import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SuperAdminShellComponent } from './layout/super-admin-shell.component';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';
import { OrganizationManagementComponent } from './pages/organization-management/organization-management.component';

const routes: Routes = [
  {
    path: '',
    component: SuperAdminShellComponent,
    children: [
      { path: '', component: SuperAdminDashboardComponent },
      { path: 'organizations', component: OrganizationManagementComponent }
    ]
  }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class SuperAdminRoutingModule {}