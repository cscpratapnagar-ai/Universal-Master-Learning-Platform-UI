import { Component, OnInit } from '@angular/core';
import { LearningPathCourse, LearningService } from '../../../../core/services/learning.service';

interface DraftOption { text:string; correct:boolean; }
interface DraftQuestion { questionText:string; questionType:'SINGLE_CHOICE'|'MULTIPLE_CHOICE'|'TRUE_FALSE'; points:number; difficultyLevel:'EASY'|'MEDIUM'|'HARD'; options:DraftOption[]; }
interface TeacherAssessment { id:string; title:string; level:string; passingScore:number; maxAttempts:number; }
interface ExistingQuestion { id:string; questionText:string; questionType:'SINGLE_CHOICE'|'MULTIPLE_CHOICE'|'TRUE_FALSE'; points:number; difficultyLevel:'EASY'|'MEDIUM'|'HARD'; sourceAssessmentId:string; sourceAssessmentTitle:string; options:{id:string;text:string;correct:boolean}[]; }

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
  assessments:TeacherAssessment[]=[]; existingQuestions:ExistingQuestion[]=[]; selectedExistingAssessmentId='';
  editingAssessmentId=''; editAssessmentTitle=''; editPassingScore=70; editMaxAttempts=3;
  editingQuestionId=''; editQuestionText=''; editQuestionType:'SINGLE_CHOICE'|'MULTIPLE_CHOICE'|'TRUE_FALSE'='SINGLE_CHOICE'; editQuestionPoints=1; editQuestionDifficulty:'EASY'|'MEDIUM'|'HARD'='MEDIUM'; editQuestionOptions:{id?:string;text:string;correct:boolean}[]=[];

  constructor(private readonly learning:LearningService){}
  ngOnInit():void{this.learning.adminLearningCatalog().subscribe({next:r=>this.courses=r.data||[],error:()=>this.error='Unable to load teaching courses.'});}
  onCourseChange():void{
    this.assessments=[];this.existingQuestions=[];this.selectedExistingAssessmentId='';
    this.editingAssessmentId='';
    if(!this.selectedCourseId)return;
    this.learning.getCourseAssessments(this.selectedCourseId).subscribe({
      next:r=>{this.assessments=r.data||[];this.loadExistingQuestions();},
      error:e=>this.error=e?.error?.message||'Unable to load existing assessments.'
    });
  }
  loadExistingQuestions():void{
    if(!this.selectedCourseId)return;
    this.learning.getQuestionBank(this.selectedCourseId).subscribe({
      next:r=>this.existingQuestions=(r.data||[]) as ExistingQuestion[],
      error:e=>this.error=e?.error?.message||'Unable to load existing questions.'
    });
  }
  questionsForAssessment(assessmentId:string):ExistingQuestion[]{return this.existingQuestions.filter(q=>q.sourceAssessmentId===assessmentId);}
  startQuestionEdit(question:ExistingQuestion):void{
    this.editingQuestionId=question.id;
    this.selectedExistingAssessmentId=question.sourceAssessmentId;
    this.editQuestionText=question.questionText;
    this.editQuestionType=question.questionType;
    this.editQuestionPoints=question.points;
    this.editQuestionDifficulty=question.difficultyLevel;
    this.editQuestionOptions=question.options.map(o=>({id:o.id,text:o.text,correct:o.correct}));
    this.error='';
  }
  cancelQuestionEdit():void{this.editingQuestionId='';}
  saveQuestionEdit():void{
    if(!this.editingQuestionId||!this.selectedExistingAssessmentId||!this.editQuestionText.trim()||!this.editQuestionOptions.length)return;
    if(!this.editQuestionOptions.every(o=>o.text.trim())||!this.editQuestionOptions.some(o=>o.correct)){this.error='Complete every option and mark at least one correct answer.';return;}
    this.busy=true;this.error='';
    this.learning.updateAssessmentQuestion(this.selectedExistingAssessmentId,this.editingQuestionId,{
      questionText:this.editQuestionText.trim(),questionType:this.editQuestionType,points:Number(this.editQuestionPoints),difficultyLevel:this.editQuestionDifficulty,
      options:this.editQuestionOptions.map(o=>({text:o.text.trim(),correct:o.correct}))
    }).subscribe({
      next:()=>{this.busy=false;this.editingQuestionId='';this.message='Question updated.';this.loadExistingQuestions();},
      error:e=>{this.busy=false;this.error=e?.error?.message||'Question could not be updated.';}
    });
  }
  addEditQuestionOption():void{this.editQuestionOptions.push({text:'',correct:false});}
  removeEditQuestionOption(index:number):void{if(this.editQuestionOptions.length>2)this.editQuestionOptions.splice(index,1);}
  onEditQuestionTypeChange():void{if(this.editQuestionType==='TRUE_FALSE')this.editQuestionOptions=[{text:'True',correct:false},{text:'False',correct:false}];}
  startAssessmentEdit(assessment:TeacherAssessment):void{
    this.editingAssessmentId=assessment.id;
    this.editAssessmentTitle=assessment.title;
    this.editPassingScore=assessment.passingScore;
    this.editMaxAttempts=assessment.maxAttempts;
    this.error='';
  }
  cancelAssessmentEdit():void{this.editingAssessmentId='';}
  saveAssessmentEdit():void{
    if(!this.editingAssessmentId||!this.editAssessmentTitle.trim())return;
    this.busy=true;this.error='';
    this.learning.updateAssessment(this.editingAssessmentId,{
      title:this.editAssessmentTitle.trim(),
      passingScore:Number(this.editPassingScore),
      maxAttempts:Number(this.editMaxAttempts)
    }).subscribe({
      next:r=>{
        this.busy=false;
        const updated=r.data;
        const index=this.assessments.findIndex(a=>a.id===updated.id);
        if(index>=0)this.assessments[index]=updated;
        this.assessments=[...this.assessments];
        this.editingAssessmentId='';
        this.message='Assessment rules updated.';
      },
      error:e=>{this.busy=false;this.error=e?.error?.message||'Assessment could not be updated.';}
    });
  }
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
      next:r=>{this.createdAssessmentId=r.data?.id||'';this.createQuestionsSequentially(0);this.onCourseChange();},
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
