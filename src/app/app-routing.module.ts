import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { RoleWorkspaceComponent } from './features/role-workspace/role-workspace.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', loadChildren: () => import('./features/public/public.module').then(m => m.PublicModule) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'learner', loadChildren: () => import('./features/learner/learner.module').then(m => m.LearnerModule) },
  { path: 'teacher', loadChildren: () => import('./features/teacher/teacher.module').then(m => m.TeacherModule) },
  { path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) },
  { path: 'super-admin', loadChildren: () => import('./features/super-admin/super-admin.module').then(m => m.SuperAdminModule) },
  { path: 'organization', loadChildren: () => import('./features/organization/organization.module').then(m => m.OrganizationModule) },
  { path: 'academy', loadChildren: () => import('./features/academy/academy.module').then(m => m.AcademyModule) },
  { path: 'examiner', component: RoleWorkspaceComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['EXAMINER'], title: 'Examiner Workspace', role: 'EXAMINER', description: 'Review assigned examination activity and follow examination governance procedures.' } },
  { path: 'question-setter', pathMatch: 'full', redirectTo: 'teacher/assessments' },
  { path: 'evaluator', component: RoleWorkspaceComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['EVALUATOR'], title: 'Evaluator Workspace', role: 'EVALUATOR', description: 'Access evaluation work assigned to your account.' } },
  { path: 'proctor', component: RoleWorkspaceComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['PROCTOR'], title: 'Exam Proctor Workspace', role: 'PROCTOR', description: 'Use your authorized examination monitoring workflow.' } },
  { path: 'parent', component: RoleWorkspaceComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['PARENT'], title: 'Parent / Guardian', role: 'PARENT', description: 'Access progress for learners linked to your account.' } },
  { path: 'finance', component: RoleWorkspaceComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['FINANCE'], title: 'Finance Workspace', role: 'FINANCE', description: 'Access authorized finance and billing operations.' } },
  { path: 'support', component: RoleWorkspaceComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['SUPPORT'], title: 'Support Workspace', role: 'SUPPORT', description: 'Assist users through authorized support workflows.' } },
  { path: 'private-teacher', component: RoleWorkspaceComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['PRIVATE_TEACHER'], title: 'Private Teacher Workspace', role: 'PRIVATE_TEACHER', description: 'Manage your private tutoring activity and bookings.' } },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
