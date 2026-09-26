import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningService } from '../../../../core/services/learning.service';

interface ProjectCourse { courseId:string; title:string; status:string; sortOrder:number; enrolled:boolean; progressPercent:number; }
@Component({selector:'app-project-workspace',templateUrl:'./project-workspace.component.html',styleUrls:['./project-workspace.component.scss']})
export class ProjectWorkspaceComponent implements OnInit {
  project:any=null; loading=true; error='';
  constructor(private readonly route:ActivatedRoute,private readonly learning:LearningService,private readonly router:Router){}
  ngOnInit():void{const id=this.route.snapshot.paramMap.get('programId');if(!id){this.error='Project not found.';this.loading=false;return;}this.learning.myProjectWorkspace(id).subscribe({next:r=>{this.project=r.data;this.loading=false;},error:e=>{this.error=e?.error?.message||'Unable to load project workspace.';this.loading=false;}})}
  openCourse(course:ProjectCourse):void{
    this.learning.myCourses().subscribe({next:r=>{const enrollment=r.data?.find(x=>x.courseId===course.courseId);if(enrollment)this.router.navigate(['/learner/course',enrollment.enrollmentId,'learn']);else this.router.navigateByUrl('/learner/courses');},error:()=>this.router.navigateByUrl('/learner/courses')});
  }
  back():void{this.router.navigateByUrl('/learner/projects');}
}
