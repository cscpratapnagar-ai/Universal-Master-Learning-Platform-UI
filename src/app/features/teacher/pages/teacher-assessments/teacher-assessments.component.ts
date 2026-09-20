import { Component, OnInit } from '@angular/core';
import { LearningPathCourse, LearningService } from '../../../../core/services/learning.service';

interface DraftOption { text:string; correct:boolean; }
interface DraftQuestion { questionText:string; questionType:'SINGLE_CHOICE'|'MULTIPLE_CHOICE'|'TRUE_FALSE'; points:number; difficultyLevel:'EASY'|'MEDIUM'|'HARD'; options:DraftOption[]; }

@Component({
  selector:'app-teacher-assessments',
  templateUrl:'./teacher-assessments.component.html',
  styleUrls:['./teacher-assessments.component.scss']
})
export class TeacherAssessmentsComponent implements OnInit {
  courses:LearningPathCourse[]=[];
  selectedCourseId=''; title=''; passingScore=70;
  draft:DraftQuestion={questionText:'',questionType:'SINGLE_CHOICE',points:1,difficultyLevel:'MEDIUM',options:[{text:'',correct:false},{text:'',correct:false}]};
  questions:DraftQuestion[]=[]; createdAssessmentId=''; busy=false; message=''; error='';

  constructor(private readonly learning:LearningService){}
  ngOnInit():void{this.learning.adminLearningCatalog().subscribe({next:r=>this.courses=r.data||[],error:()=>this.error='Unable to load teaching courses.'});}
  addOption():void{this.draft.options.push({text:'',correct:false});}
  removeOption(index:number):void{if(this.draft.options.length>2)this.draft.options.splice(index,1);}
  toggleType():void{
    if(this.draft.questionType==='TRUE_FALSE') this.draft.options=[{text:'True',correct:false},{text:'False',correct:false}];
    else if(this.draft.options.length<2) this.draft.options=[{text:'',correct:false},{text:'',correct:false}];
  }
  addQuestion():void{
    this.error='';
    const valid=!!this.draft.questionText.trim()&&this.draft.options.every(o=>o.text.trim())&&this.draft.options.some(o=>o.correct);
    if(!valid){this.error='Add a question, complete every option, and mark at least one correct answer.';return;}
    this.questions.push(JSON.parse(JSON.stringify(this.draft)));
    this.draft={questionText:'',questionType:this.draft.questionType,points:1,difficultyLevel:'MEDIUM',options:this.draft.questionType==='TRUE_FALSE'?[{text:'True',correct:false},{text:'False',correct:false}]:[{text:'',correct:false},{text:'',correct:false}]};
  }
  removeQuestion(index:number):void{this.questions.splice(index,1);}
  publishAssessment():void{
    this.error='';this.message='';
    if(!this.selectedCourseId||!this.title.trim()){this.error='Select a course and enter an assessment title.';return;}
    if(!this.questions.length){this.error='Add at least one question before publishing.';return;}
    this.busy=true;
    this.learning.createAssessment(this.selectedCourseId,{title:this.title.trim(),passingScore:this.passingScore}).subscribe({
      next:r=>{this.createdAssessmentId=r.data?.id||'';this.createQuestionsSequentially(0);},
      error:e=>{this.busy=false;this.error=e?.error?.message||'Assessment creation failed.';}
    });
  }
  private createQuestionsSequentially(index:number):void{
    if(index>=this.questions.length){this.busy=false;this.message='Assessment published to the selected course.';return;}
    const q=this.questions[index];
    this.learning.createAssessmentQuestion(this.createdAssessmentId,{questionText:q.questionText.trim(),questionType:q.questionType,points:q.points,difficultyLevel:q.difficultyLevel,options:q.options.map(o=>({text:o.text.trim(),correct:o.correct}))}).subscribe({
      next:()=>this.createQuestionsSequentially(index+1),
      error:e=>{this.busy=false;this.error=e?.error?.message||'Question could not be created.';}
    });
  }
}
