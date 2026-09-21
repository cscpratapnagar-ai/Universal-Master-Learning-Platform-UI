import { Component, OnInit } from '@angular/core';
import { LearningPathCourse, LearningService } from '../../../../core/services/learning.service';

interface BankQuestion { id:string; questionText:string; questionType:string; points:number; difficultyLevel:string; sourceAssessmentTitle:string; options:{id:string;optionText:string;correct:boolean}[]; }
interface TargetAssessment { id:string; title:string; level:string; passingScore:number; maxAttempts:number; }

@Component({selector:'app-teacher-question-bank',templateUrl:'./teacher-question-bank.component.html',styleUrls:['./teacher-question-bank.component.scss']})
export class TeacherQuestionBankComponent implements OnInit {
  courses:LearningPathCourse[]=[]; assessments:TargetAssessment[]=[]; questions:BankQuestion[]=[];
  courseId=''; assessmentId=''; difficulty=''; type=''; search=''; loading=false; message=''; error='';

  constructor(private readonly learning:LearningService){}
  ngOnInit():void{this.learning.adminLearningCatalog().subscribe({next:r=>this.courses=r.data||[],error:()=>this.error='Unable to load courses.'});}
  load():void{
    this.message='';this.error='';
    if(!this.courseId){this.questions=[];this.assessments=[];return;}
    this.loading=true;
    this.learning.getCourseAssessments(this.courseId).subscribe({next:r=>this.assessments=r.data||[],error:()=>this.assessments=[]});
    this.learning.getQuestionBank(this.courseId,{difficultyLevel:this.difficulty,questionType:this.type}).subscribe({next:r=>{this.questions=(r.data||[]) as BankQuestion[];this.loading=false;},error:e=>{this.loading=false;this.error=e?.error?.message||'Unable to load question bank.';}});
  }
  filtered():BankQuestion[]{const term=this.search.trim().toLowerCase();return !term?this.questions:this.questions.filter(q=>q.questionText.toLowerCase().includes(term));}
  reuse(q:BankQuestion):void{
    if(!this.assessmentId){this.error='Select a target assessment first.';return;}
    this.learning.reuseAssessmentQuestion(this.assessmentId,q.id).subscribe({next:()=>this.message='Question reused successfully.',error:e=>this.error=e?.error?.message||'Question could not be reused.'});
  }
}
