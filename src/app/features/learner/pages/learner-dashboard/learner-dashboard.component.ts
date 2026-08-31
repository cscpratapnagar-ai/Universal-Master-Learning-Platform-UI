import { Component,OnInit } from '@angular/core'; import { Router } from '@angular/router';
import { User } from '../../../../core/models/auth.model'; import { AuthService } from '../../../../core/services/auth.service'; import { ThemeMode,ThemeService } from '../../../../core/services/theme.service'; import { LearningService } from '../../../../core/services/learning.service'; import { StudentCourse } from '../../../../core/models/learning.model';
interface DashboardStat{label:string;value:string;change:string;icon:string;} interface ActivityItem{title:string;meta:string;icon:string;}
@Component({selector:'app-learner-dashboard',templateUrl:'./learner-dashboard.component.html',styleUrls:['./learner-dashboard.component.scss']})
export class LearnerDashboardComponent implements OnInit{
user:User|null=null;isLoggingOut=false;activeNav='Overview';notificationsOpen=false;theme:ThemeMode='dark';courses:StudentCourse[]=[];
readonly navigation=[{label:'Overview',icon:'⌂'},{label:'My Learning',icon:'▣'},{label:'Live Classes',icon:'◉'},{label:'AI Tutor',icon:'✦'},{label:'Assessments',icon:'✓'},{label:'Certificates',icon:'◇'}];
readonly stats:DashboardStat[]=[{label:'Learning streak',value:'12 days',change:'+3 this week',icon:'↗'},{label:'Hours learned',value:'48.5',change:'+6.2 hrs',icon:'◷'},{label:'Courses active',value:'00',change:'Live data',icon:'▣'},{label:'Average score',value:'92%',change:'+4.8%',icon:'◎'}];
readonly activity:ActivityItem[]=[];
constructor(private authService:AuthService,private themeService:ThemeService,private router:Router,private learning:LearningService){}
ngOnInit(){this.theme=this.themeService.theme;this.themeService.theme$.subscribe(t=>this.theme=t);if(!this.authService.isAuthenticated()){this.router.navigateByUrl('/auth/login');return;}this.user=this.authService.currentUser();if(this.user)this.learning.myCourses(this.user.id).subscribe({next:r=>this.courses=r.data||[]});}
toggleTheme(){this.themeService.toggle();} selectNav(label:string){this.activeNav=label;if(label==='My Learning')this.router.navigateByUrl('/learner/courses');}
continueCourse(course:StudentCourse){this.router.navigate(['/learner/course',course.enrollmentId]);}
logout(){if(this.isLoggingOut)return;this.isLoggingOut=true;const r=this.authService.logout();if(!r){this.router.navigateByUrl('/auth/login');return;}r.subscribe({next:()=>this.router.navigateByUrl('/auth/login'),error:()=>this.router.navigateByUrl('/auth/login')});}
}