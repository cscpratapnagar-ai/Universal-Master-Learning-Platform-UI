import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningService } from '../../../../core/services/learning.service';
import { AiLearningOrchestration, PersonalizationOrchestration } from '../../../../core/models/ai-learning.model';
import { AiTutorResponse } from '../../../../core/models/ai-tutor.model';
import { AssessmentService, AssessmentView } from '../../../../core/services/assessment.service';

@Component({selector:'app-ai-tutor',templateUrl:'./ai-tutor.component.html',styleUrls:['./ai-tutor.component.scss']})
export class AiTutorComponent implements OnInit {
  enrollmentId=''; question=''; loading=true; sending=false; error='';
  orchestration?:AiLearningOrchestration;
  personalization?:PersonalizationOrchestration;
  response?:AiTutorResponse;
  practiceAssessments:AssessmentView[]=[];
  practiceLessonId='';
  practiceLessonTitle='';
  practiceLoading=false;

  constructor(private readonly route:ActivatedRoute,private readonly router:Router,private readonly learning:LearningService,private readonly assessments:AssessmentService){}

  ngOnInit():void {
    this.enrollmentId=this.route.snapshot.paramMap.get('enrollmentId')||'';
    if(!this.enrollmentId){this.loading=false;this.error='A course enrollment is required.';return;}
    this.learning.getAiOrchestration(this.enrollmentId).subscribe({
      next:r=>{this.orchestration=r.data;this.loadPracticeTarget();this.loading=false;},
      error:()=>{this.error='Unable to load your learning guidance right now.';this.loading=false;}
    });
    this.learning.getPersonalizationOrchestration(this.enrollmentId).subscribe({
      next:r=>{this.personalization=r.data;this.loadPracticeTarget();},
      error:()=>{}
    });
  }

  private loadPracticeTarget():void {
    const targetId=this.personalization?.targetLessonId;
    if(!targetId||this.practiceLessonId===targetId)return;
    this.practiceLessonId=targetId;
    this.practiceLessonTitle=this.personalization?.targetLessonTitle||'Recommended practice';
    this.practiceLoading=true;
    this.assessments.forLesson(targetId).subscribe({
      next:r=>{this.practiceAssessments=r.data||[];this.practiceLoading=false;},
      error:()=>{this.practiceAssessments=[];this.practiceLoading=false;}
    });
  }

  ask():void {
    const q=this.question.trim();if(!q||this.sending)return;
    this.sending=true;this.error='';
    this.learning.respondToAiTutor(this.enrollmentId,q).subscribe({
      next:r=>{this.response=r.data;this.question='';this.sending=false;},
      error:()=>{this.error='The tutor could not respond right now. Please try again.';this.sending=false;}
    });
  }

  usePrompt(prompt:string):void{this.question=prompt;}

  startPractice(assessment:AssessmentView):void{
    if(assessment.passed||assessment.attemptsUsed>=assessment.maxAttempts)return;
    this.router.navigate(['/learner/quiz'],{queryParams:{assessmentId:assessment.id}});
  }

  get practiceReady():boolean{return this.practiceAssessments.some(a=>!a.passed&&a.attemptsUsed<a.maxAttempts);}
  get prompts():string[]{return ['Explain this concept in a simple way','Give me a worked example','Quiz me on my weak area'];}
}
