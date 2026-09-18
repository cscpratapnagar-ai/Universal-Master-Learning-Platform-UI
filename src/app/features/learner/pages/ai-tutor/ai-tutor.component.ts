import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LearningService } from '../../../../core/services/learning.service';
import { AiLearningOrchestration } from '../../../../core/models/ai-learning.model';
import { AiTutorResponse } from '../../../../core/models/ai-tutor.model';

@Component({selector:'app-ai-tutor',templateUrl:'./ai-tutor.component.html',styleUrls:['./ai-tutor.component.scss']})
export class AiTutorComponent implements OnInit {
  enrollmentId=''; question=''; loading=true; sending=false; error=''; orchestration?:AiLearningOrchestration; response?:AiTutorResponse;
  constructor(private readonly route:ActivatedRoute,private readonly learning:LearningService){}
  ngOnInit():void {
    this.enrollmentId=this.route.snapshot.paramMap.get('enrollmentId')||'';
    this.learning.getAiOrchestration(this.enrollmentId).subscribe({next:r=>{this.orchestration=r.data;this.loading=false},error:()=>{this.error='Unable to load your learning guidance right now.';this.loading=false}});
  }
  ask():void {
    const q=this.question.trim(); if(!q||this.sending)return;
    this.sending=true;this.error='';
    this.learning.respondToAiTutor(this.enrollmentId,q).subscribe({next:r=>{this.response=r.data;this.question='';this.sending=false},error:()=>{this.error='The tutor could not respond right now. Please try again.';this.sending=false}});
  }
  usePrompt(prompt:string):void{this.question=prompt;}
  get prompts():string[]{return ['Explain this concept in a simple way','Give me a worked example','Quiz me on my weak area'];}
}
