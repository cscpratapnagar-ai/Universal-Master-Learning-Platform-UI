import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AssessmentBuilderComponent } from './pages/assessment-builder/assessment-builder.component';
import { CurriculumComponent } from './pages/curriculum/curriculum.component';
import { LearningPathComponent } from './pages/learning-path/learning-path.component';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

const routes: Routes = [
  { path: '', component: AdminDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ADMIN_ROLES } },
  { path: 'curriculum', component: CurriculumComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ADMIN_ROLES } },
  { path: 'assessments/new', component: AssessmentBuilderComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ADMIN_ROLES } },
  { path: 'learning-path', component: LearningPathComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ADMIN_ROLES } }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class AdminRoutingModule {}
