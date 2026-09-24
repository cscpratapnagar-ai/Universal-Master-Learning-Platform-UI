import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherDashboardComponent } from './pages/teacher-dashboard/teacher-dashboard.component';
import { TeacherCoursesComponent } from './pages/teacher-courses/teacher-courses.component';
import { TeacherAssessmentsComponent } from './pages/teacher-assessments/teacher-assessments.component';
import { TeacherQuestionBankComponent } from './pages/teacher-question-bank/teacher-question-bank.component';
import { TeacherLearnersComponent } from './pages/teacher-learners/teacher-learners.component';

@NgModule({
  declarations: [TeacherDashboardComponent, TeacherCoursesComponent, TeacherAssessmentsComponent, TeacherQuestionBankComponent, TeacherLearnersComponent],
  imports: [SharedModule, TeacherRoutingModule]
})
export class TeacherModule {}
