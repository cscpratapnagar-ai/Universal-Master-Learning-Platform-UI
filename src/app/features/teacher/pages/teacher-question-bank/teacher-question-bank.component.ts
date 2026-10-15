import { Component, OnInit } from '@angular/core';
import { LearningPathCourse, LearningService } from '../../../../core/services/learning.service';

interface BankQuestion { id:string; questionText:string; questionType:string; points:number; difficultyLevel:string; sourceAssessmentTitle:string; options:{id:string;optionText:string;correct:boolean}[]; }
interface TargetAssessment { id:string; title:string; level:string; passingScore:number; maxAttempts:number; }

@Component({selector:'app-teacher-question-bank',templateUrl:'./teacher-question-bank.component.html',styleUrls:['./teacher-question-bank.component.scss']})
export class TeacherQuestionBankComponent implements OnInit {
  courses:LearningPathCourse[]=[]; assessments:TargetAssessment[]=[]; questions:BankQuestion[]=[];
  courseId=''; assessmentId=''; difficulty=''; type=''; search=''; loading=false; message=''; error='';
  readonly reusingQuestionIds = new Set<string>();

  constructor(private readonly learning:LearningService){}
  ngOnInit():void{this.learning.adminLearningCatalog().subscribe({next:r=>this.courses=r.data||[],error:()=>this.error='Unable to load courses.'});}
  courseChanged():void{
    this.assessmentId='';
    this.assessments=[];
    this.questions=[];
    this.load();
  }
  load():void{
    this.message='';this.error='';
    if(!this.courseId){this.loading=false;this.assessmentId='';this.questions=[];this.assessments=[];return;}
    const requestedCourseId=this.courseId;
    this.loading=true;
    this.learning.getCourseAssessments(requestedCourseId).subscribe({
      next:r=>{if(this.courseId===requestedCourseId)this.assessments=r.data||[];},
      error:()=>{if(this.courseId===requestedCourseId)this.error='Unable to load assessments for this course.';}
    });
    this.learning.getQuestionBank(requestedCourseId,{difficultyLevel:this.difficulty,questionType:this.type}).subscribe({
      next:r=>{if(this.courseId===requestedCourseId)this.questions=(r.data||[]) as BankQuestion[];this.loading=false;},
      error:e=>{this.loading=false;if(this.courseId===requestedCourseId)this.error=e?.error?.message||'Unable to load question bank.';}
    });
  }
  filtered():BankQuestion[]{const term=this.search.trim().toLowerCase();return !term?this.questions:this.questions.filter(q=>q.questionText.toLowerCase().includes(term));}
  reuse(q:BankQuestion):void{
    if(!this.assessmentId){this.error='Select a target assessment first.';return;}
    if(this.reusingQuestionIds.has(q.id))return;
    const targetAssessmentId=this.assessmentId;
    this.error='';this.message='';
    this.reusingQuestionIds.add(q.id);
    this.learning.reuseAssessmentQuestion(targetAssessmentId,q.id).subscribe({
      next:()=>{this.reusingQuestionIds.delete(q.id);this.message='Question reused successfully.';},
      error:e=>{this.reusingQuestionIds.delete(q.id);this.error=e?.error?.message||'Question could not be reused.';}
    });
  }
}
