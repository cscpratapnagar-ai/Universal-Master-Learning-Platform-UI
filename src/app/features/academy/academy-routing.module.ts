import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { AcademyDashboardComponent } from './pages/academy-dashboard/academy-dashboard.component';
import { TeacherManagementComponent } from './pages/teacher-management/teacher-management.component';

const ACADEMY_ROLES = ['SUPER_ADMIN', 'ADMIN', 'ORG_ADMIN', 'INSTRUCTOR', 'TEACHER', 'LEARNER', 'STUDENT'];

const routes: Routes = [
  { path: '', component: AcademyDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ACADEMY_ROLES } },
  { path: 'teachers', component: TeacherManagementComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SUPER_ADMIN','ADMIN','ORG_ADMIN'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademyRoutingModule {}
