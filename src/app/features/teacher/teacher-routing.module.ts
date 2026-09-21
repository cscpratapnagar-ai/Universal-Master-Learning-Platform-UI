import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { TeacherDashboardComponent } from './pages/teacher-dashboard/teacher-dashboard.component';
import { TeacherCoursesComponent } from './pages/teacher-courses/teacher-courses.component';
import { TeacherAssessmentsComponent } from './pages/teacher-assessments/teacher-assessments.component';
import { TeacherQuestionBankComponent } from './pages/teacher-question-bank/teacher-question-bank.component';

const TEACHER_ROLES = ['INSTRUCTOR', 'TEACHER'];

const routes: Routes = [
  { path: '', component: TeacherDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: TEACHER_ROLES } },
  { path: 'courses', component: TeacherCoursesComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: TEACHER_ROLES } },
  { path: 'assessments', component: TeacherAssessmentsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: TEACHER_ROLES } },
  { path: 'question-bank', component: TeacherQuestionBankComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: TEACHER_ROLES } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule {}
