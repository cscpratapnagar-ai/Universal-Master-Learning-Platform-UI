import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { TeacherDashboardComponent } from './pages/teacher-dashboard/teacher-dashboard.component';
import { TeacherCoursesComponent } from './pages/teacher-courses/teacher-courses.component';
import { TeacherAssessmentsComponent } from './pages/teacher-assessments/teacher-assessments.component';
import { TeacherQuestionBankComponent } from './pages/teacher-question-bank/teacher-question-bank.component';

const routes: Routes = [
  { path: '', component: TeacherDashboardComponent, canActivate: [AuthGuard] },
  { path: 'courses', component: TeacherCoursesComponent, canActivate: [AuthGuard] },
  { path: 'assessments', component: TeacherAssessmentsComponent, canActivate: [AuthGuard] },
  { path: 'question-bank', component: TeacherQuestionBankComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule {}
