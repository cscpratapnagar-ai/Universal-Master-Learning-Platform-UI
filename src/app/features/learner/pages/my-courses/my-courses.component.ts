import { Component,OnInit } from '@angular/core'; import { Router } from '@angular/router'; import { AuthService } from '../../../../core/services/auth.service'; import { LearningService } from '../../../../core/services/learning.service'; import { StudentCourse } from '../../../../core/models/learning.model';
@Component({selector:'app-my-courses',templateUrl:'./my-courses.component.html',styleUrls:['./my-courses.component.scss']})
export class MyCoursesComponent implements OnInit { courses:StudentCourse[]=[]; loading=true; error='';
constructor(private auth:AuthService,private learning:LearningService,private router:Router){}
ngOnInit(){const u=this.auth.currentUser(); if(!u){this.router.navigateByUrl('/auth/login');return;} this.learning.myCourses(u.id).subscribe({next:r=>{this.courses=r.data||[];this.loading=false;},error:()=>{this.error='Unable to load your courses.';this.loading=false;}});}
open(c:StudentCourse){this.router.navigate(['/learner/course',c.enrollmentId]);}
}