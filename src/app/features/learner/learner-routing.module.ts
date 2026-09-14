import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { LearnerDashboardComponent } from './pages/learner-dashboard/learner-dashboard.component';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { CoursePlayerComponent } from './pages/course-player/course-player.component';
import { ProgressAnalyticsComponent } from './pages/progress-analytics/progress-analytics.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { AssessmentResultComponent } from './pages/assessment-result/assessment-result.component';
import { CertificateComponent } from './pages/certificate/certificate.component';
const routes:Routes=[
{path:'',component:LearnerDashboardComponent,canActivate:[AuthGuard]},
{path:'courses',component:MyCoursesComponent,canActivate:[AuthGuard]},
{path:'course/:enrollmentId',component:CourseDetailsComponent,canActivate:[AuthGuard]},
{path:'course/:enrollmentId/learn',component:CoursePlayerComponent,canActivate:[AuthGuard]},
{path:'course/:enrollmentId/progress',component:ProgressAnalyticsComponent,canActivate:[AuthGuard]},
{path:'quiz',component:QuizComponent,canActivate:[AuthGuard]},
{path:'assessment-result',component:AssessmentResultComponent,canActivate:[AuthGuard]},
{path:'certificates',component:CertificateComponent,canActivate:[AuthGuard]}];
@NgModule({imports:[RouterModule.forChild(routes)],exports:[RouterModule]}) export class LearnerRoutingModule{}