import { Component,OnInit } from '@angular/core'; import { ActivatedRoute,Router } from '@angular/router'; import { LearningService } from '../../../../core/services/learning.service'; import { CourseLearning,Lesson } from '../../../../core/models/learning.model';
@Component({selector:'app-course-player',templateUrl:'./course-player.component.html',styleUrls:['./course-player.component.scss']})
export class CoursePlayerComponent implements OnInit { data?:CourseLearning; enrollmentId=''; selected?:Lesson; loading=true;
constructor(private route:ActivatedRoute,private learning:LearningService,private router:Router){}
ngOnInit(){this.enrollmentId=this.route.snapshot.paramMap.get('enrollmentId')||'';this.load();}
load(){this.learning.courseLearning(this.enrollmentId).subscribe({next:r=>{this.data=r.data;this.selected=this.data.modules.flatMap(m=>m.lessons).find(l=>!l.completed)||this.data.modules.flatMap(m=>m.lessons)[0];this.loading=false;},error:()=>{this.loading=false;}});}
select(l:Lesson){this.selected=l;}
complete(){if(!this.selected)return;this.learning.completeLesson(this.enrollmentId,this.selected.id).subscribe(()=>this.load());}
back(){this.router.navigateByUrl('/learner/courses');}
}