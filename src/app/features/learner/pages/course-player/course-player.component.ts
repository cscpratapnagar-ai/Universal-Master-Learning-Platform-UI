import { Component,OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { LearningService } from '../../../../core/services/learning.service';
import { CourseLearning,Lesson } from '../../../../core/models/learning.model';
import { AssessmentService, AssessmentView } from '../../../../core/services/assessment.service';
import { AiTutorResponse } from '../../../../core/models/ai-tutor.model';

@Component({selector:'app-course-player',templateUrl:'./course-player.component.html',styleUrls:['./course-player.component.scss']})
export class CoursePlayerComponent implements OnInit {
  data?:CourseLearning; enrollmentId=''; selected?:Lesson; assessment?:AssessmentView; loading=true; assessmentLoading=false;
  tutorOpen=false; tutorQuestion=''; tutorLoading=false; tutorError=''; tutorResponse?:AiTutorResponse; tutorHistory:{question:string;answer:string}[]=[];
  constructor(private route:ActivatedRoute,private learning:LearningService,private assessments:AssessmentService,private router:Router){}
  ngOnInit(){this.enrollmentId=this.route.snapshot.paramMap.get('enrollmentId')||'';this.load();}
  load(){this.learning.courseLearning(this.enrollmentId).subscribe({next:r=>{this.data=r.data;const all=this.data.modules.flatMap(m=>m.lessons);this.selected=all.find(l=>!l.completed&&!l.locked)||all[0];this.loading=false;this.loadAssessment();},error:()=>{this.loading=false;}});}
  select(l:Lesson){if(l.locked)return;this.selected=l;this.loadAssessment();}
  loadAssessment(){this.assessment=undefined;if(!this.selected)return;this.assessmentLoading=true;this.assessments.forLesson(this.selected.id).subscribe({next:r=>{this.assessment=r.data?.[0];this.assessmentLoading=false;},error:()=>{this.assessmentLoading=false;}});}
  openAssessment(){if(this.assessment)this.router.navigate(['/learner/quiz'],{queryParams:{assessmentId:this.assessment.id}});}
  complete(){if(!this.selected||this.selected.completed||this.selected.locked)return;if(this.assessment&&!this.assessment.passed){this.openAssessment();return;}this.learning.completeLesson(this.enrollmentId,this.selected.id).subscribe({next:()=>this.load(),error:()=>{}});}
  toggleTutor(){this.tutorOpen=!this.tutorOpen;this.tutorError='';}
  askTutor():void{const question=this.tutorQuestion.trim();if(!question||this.tutorLoading)return;this.tutorLoading=true;this.tutorError='';this.learning.respondToAiTutor(this.enrollmentId,question).subscribe({next:r=>{const answer=r.data?.response||'I could not generate an answer right now.';this.tutorResponse=r.data;this.tutorHistory=[...this.tutorHistory,{question,answer}];this.tutorQuestion='';this.tutorLoading=false;},error:()=>{this.tutorError='The AI Tutor is temporarily unavailable. Try again in a moment.';this.tutorLoading=false;}});}
  back(){this.router.navigateByUrl('/learner/courses');}
}
