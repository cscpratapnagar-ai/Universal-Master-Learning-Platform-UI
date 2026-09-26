import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningService } from '../../../../core/services/learning.service';

interface ProjectCourse { courseId:string; title:string; status:string; sortOrder:number; enrolled:boolean; progressPercent:number; enrollmentId?:string|null; }
interface ProjectActivity { id:string; action:string; details?:string; actor:string; createdAt:string; }

@Component({selector:'app-project-workspace',templateUrl:'./project-workspace.component.html',styleUrls:['./project-workspace.component.scss']})
export class ProjectWorkspaceComponent implements OnInit {
  project:any=null; milestones:any[]=[]; activities:ProjectActivity[]=[]; nextMilestone:any=null;
  milestoneCount=0; completedMilestones=0; overdueMilestones=0; loading=true; error='';

  constructor(private readonly route:ActivatedRoute,private readonly learning:LearningService,private readonly router:Router){}

  ngOnInit():void{
    const id=this.route.snapshot.paramMap.get('programId');
    if(!id){this.error='Project not found.';this.loading=false;return;}
    this.learning.myProjectWorkspace(id).subscribe({
      next:r=>{
        this.project=r.data;
        this.learning.myProjectExecution(id).subscribe({
          next:x=>{this.milestones=x.data?.milestones||[];this.nextMilestone=x.data?.nextMilestone||null;this.milestoneCount=x.data?.milestoneCount||0;this.completedMilestones=x.data?.completedMilestoneCount||0;this.overdueMilestones=x.data?.overdueMilestoneCount||0;},
          error:()=>{}
        });
        this.learning.myProjectActivity(id).subscribe({next:x=>this.activities=x.data||[],error:()=>{}});
        this.loading=false;
      },
      error:e=>{this.error=e?.error?.message||'Unable to load project workspace.';this.loading=false;}
    });
  }

  openCourse(course:ProjectCourse):void{
    if(course.enrollmentId){this.router.navigate(['/learner/course',course.enrollmentId,'learn']);return;}
    this.router.navigateByUrl('/learner/courses');
  }

  back():void{this.router.navigateByUrl('/learner/projects');}
}
