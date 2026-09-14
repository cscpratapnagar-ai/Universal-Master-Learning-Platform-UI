import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { LearnerRoutingModule } from './learner-routing.module';
import { LearnerDashboardComponent } from './pages/learner-dashboard/learner-dashboard.component';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { CoursePlayerComponent } from './pages/course-player/course-player.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { AssessmentResultComponent } from './pages/assessment-result/assessment-result.component';
import { CertificateComponent } from './pages/certificate/certificate.component';

@NgModule({
  declarations: [LearnerDashboardComponent, MyCoursesComponent, CourseDetailsComponent, CoursePlayerComponent, QuizComponent, AssessmentResultComponent, CertificateComponent],
  imports: [SharedModule, LearnerRoutingModule]
})
export class LearnerModule {}
