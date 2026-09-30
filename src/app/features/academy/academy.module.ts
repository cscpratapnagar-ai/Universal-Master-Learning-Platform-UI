import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AcademyRoutingModule } from './academy-routing.module';
import { AcademyDashboardComponent } from './pages/academy-dashboard/academy-dashboard.component';
import { TeacherManagementComponent } from './pages/teacher-management/teacher-management.component';
import { LearnerManagementComponent } from './pages/learner-management/learner-management.component';
import { CourseManagementComponent } from './pages/course-management/course-management.component';
import { AssessmentManagementComponent } from './pages/assessment-management/assessment-management.component';
import { QuestionBankManagementComponent } from './pages/question-bank-management/question-bank-management.component';

@NgModule({
  declarations: [AcademyDashboardComponent],
  imports: [SharedModule, AcademyRoutingModule]
})
export class AcademyModule {}
