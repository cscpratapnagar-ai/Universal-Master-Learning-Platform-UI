import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AssessmentBuilderComponent } from './pages/assessment-builder/assessment-builder.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'assessments/new', component: AssessmentBuilderComponent }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class AdminRoutingModule {}
