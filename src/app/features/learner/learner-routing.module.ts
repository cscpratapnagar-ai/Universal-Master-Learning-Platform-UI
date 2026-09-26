import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { LearnerDashboardComponent } from './pages/learner-dashboard/learner-dashboard.component';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { CoursePlayerComponent } from './pages/course-player/course-player.component';
import { ProgressAnalyticsComponent } from './pages/progress-analytics/progress-analytics.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { AssessmentResultComponent } from './pages/assessment-result/assessment-result.component';
import { CertificateComponent } from './pages/certificate/certificate.component';
import { AiTutorComponent } from './pages/ai-tutor/ai-tutor.component';
import { MyProjectsComponent } from './pages/my-projects/my-projects.component';

const LEARNER_ROLES = ['LEARNER', 'STUDENT'];

const routes: Routes = [
  { path: '', component: LearnerDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: LEARNER_ROLES } },
  { path: 'projects', component: MyProjectsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: LEARNER_ROLES } },
  { path: 'courses', component: MyCoursesComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: LEARNER_ROLES } },
  { path: 'course/:enrollmentId', component: CourseDetailsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: LEARNER_ROLES } },
  { path: 'course/:enrollmentId/learn', component: CoursePlayerComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: LEARNER_ROLES } },
  { path: 'course/:enrollmentId/progress', component: ProgressAnalyticsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: LEARNER_ROLES } },
  { path: 'course/:enrollmentId/profile', component: ProfileComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: LEARNER_ROLES } },
  { path: 'quiz', component: QuizComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: LEARNER_ROLES } },
  { path: 'assessment-result', component: AssessmentResultComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: LEARNER_ROLES } },
  { path: 'course/:enrollmentId/ai-tutor', component: AiTutorComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: LEARNER_ROLES } },
  { path: 'certificates', component: CertificateComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: LEARNER_ROLES } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnerRoutingModule {}
