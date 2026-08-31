import { Component } from '@angular/core'; import { Router } from '@angular/router'; import { AssessmentService } from '../../../../core/services/assessment.service'; import { AuthService } from '../../../../core/services/auth.service';
@Component({selector:'app-quiz',templateUrl:'./quiz.component.html',styleUrls:['./quiz.component.scss']})
export class QuizComponent{assessmentId='';questions:any[]=[];answers:Record<string,string>={};submitting=false;error='';
constructor(private api:AssessmentService,private auth:AuthService,private router:Router){}
submit(){const user=this.auth.currentUser();if(!user||!this.assessmentId){this.error='Assessment is not ready yet.';return;}this.submitting=true;this.api.submit(this.assessmentId,user.id,this.answers).subscribe({next:r=>{this.submitting=false;this.router.navigateByUrl('/learner/assessment-result',{state:{result:r.data||r}});},error:()=>{this.submitting=false;this.error='Unable to submit assessment.';}})}
select(questionId:string,optionId:string){this.answers[questionId]=optionId;}
}