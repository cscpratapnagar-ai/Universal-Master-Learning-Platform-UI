import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningService } from '../../../../core/services/learning.service';

interface ProjectCourse { courseId:string; title:string; status:string; sortOrder:number; enrolled:boolean; progressPercent:number; enrollmentId?:string|null; }
interface ProjectActivity { id:string; action:string; details?:string; actor:string; createdAt:string; }

@Component({selector:'app-project-workspace',templateUrl:'./project-workspace.component.html',styleUrls:['./project-workspace.component.scss']})
export class ProjectWorkspaceComponent implements OnInit {
  project:any=null; milestones:any[]=[]; activities:ProjectActivity[]=[]; nextMilestone:any=null;
  milestoneCount=0; completedMilestones=0; overdueMilestones=0; loading=true; error=''; attentionTitle='On track'; attentionText='Keep moving through your next project milestone.'; attentionLevel='CALM';

  constructor(private readonly route:ActivatedRoute,private readonly learning:LearningService,private readonly router:Router){}

  ngOnInit():void{
    const id=this.route.snapshot.paramMap.get('programId');
    if(!id){this.error='Project not found.';this.loading=false;return;}
    this.learning.myProjectWorkspace(id).subscribe({
      next:r=>{
        this.project=r.data;
        this.learning.myProjectExecution(id).subscribe({
          next:x=>{this.milestones=x.data?.milestones||[];this.nextMilestone=x.data?.nextMilestone||null;this.milestoneCount=x.data?.milestoneCount||0;this.completedMilestones=x.data?.completedMilestoneCount||0;this.overdueMilestones=x.data?.overdueMilestoneCount||0;this.updateAttention();},
          error:()=>{}
        });
        this.learning.myProjectActivity(id).subscribe({next:x=>this.activities=x.data||[],error:()=>{}});
        this.loading=false;
      },
      error:e=>{this.error=e?.error?.message||'Unable to load project workspace.';this.loading=false;}
    });
  }

  updateAttention():void{ const progress=Number(this.project?.progressPercent||0); if(this.overdueMilestones>0){this.attentionLevel='URGENT';this.attentionTitle='Deadline attention';this.attentionText=`${this.overdueMilestones} milestone${this.overdueMilestones>1?'s are':' is'} overdue. Continue the next available course and clear the deadline blocker.`;return;} if(progress===0&&this.milestoneCount>0){this.attentionLevel='START';this.attentionTitle='Start your project';this.attentionText='Your project is assigned but learning has not started yet. Open the first available course to begin.';return;} if(progress>=100){this.attentionLevel='DONE';this.attentionTitle='Project completed';this.attentionText='You have completed the assigned project learning path.';return;} this.attentionLevel='CALM';this.attentionTitle=this.nextMilestone?'Next milestone: '+this.nextMilestone.title:'Keep going';this.attentionText=this.nextMilestone?.dueDate?`Your next milestone is due ${this.nextMilestone.dueDate}. Keep your course progress moving.`:'Continue your assigned courses to keep the project moving.'; }

  openCourse(course:ProjectCourse):void{
    if(course.enrollmentId){this.router.navigate(['/learner/course',course.enrollmentId,'learn']);return;}
    this.router.navigateByUrl('/learner/courses');
  }

  back():void{this.router.navigateByUrl('/learner/projects');}
}
