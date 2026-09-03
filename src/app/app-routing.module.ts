import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./features/public/public.module').then(m => m.PublicModule) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'learner', loadChildren: () => import('./features/learner/learner.module').then(m => m.LearnerModule) },
  { path: 'admin', loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule) },
  { path: 'super-admin', loadChildren: () => import('./features/super-admin/super-admin.module').then(m => m.SuperAdminModule) },
  { path: 'organization', loadChildren: () => import('./features/organization/organization.module').then(m => m.OrganizationModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
