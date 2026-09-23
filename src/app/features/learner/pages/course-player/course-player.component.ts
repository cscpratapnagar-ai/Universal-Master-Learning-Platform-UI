import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningService } from '../../../../core/services/learning.service';
import { CourseLearning, Lesson, CourseModule } from '../../../../core/models/learning.model';
import { AssessmentService, AssessmentView } from '../../../../core/services/assessment.service';
import { AiTutorResponse } from '../../../../core/models/ai-tutor.model';

@Component({selector:'app-course-player',templateUrl:'./course-player.component.html',styleUrls:['./course-player.component.scss']})
export class CoursePlayerComponent implements OnInit {
  data?: CourseLearning; enrollmentId=''; selected?: Lesson; assessment?: AssessmentView; loading=true; assessmentLoading=false;
  error=''; completing=false;
  tutorOpen=false; tutorQuestion=''; tutorLoading=false; tutorError=''; tutorResponse?: AiTutorResponse; tutorHistory:{question:string;answer:string}[]=[];
  constructor(private route:ActivatedRoute,private learning:LearningService,private assessments:AssessmentService,private router:Router){}
  ngOnInit(){this.enrollmentId=this.route.snapshot.paramMap.get('enrollmentId')||'';if(!this.enrollmentId){this.loading=false;this.error='This learning session could not be identified.';return;}this.load();}
  get allLessons():Lesson[]{return this.data?.modules.flatMap(m=>m.lessons)||[];}
  get selectedIndex():number{return this.selected?this.allLessons.findIndex(l=>l.id===this.selected?.id):-1;}
  get previousLesson():Lesson|undefined{const i=this.selectedIndex;return i>0?this.allLessons[i-1]:undefined;}
  get nextLesson():Lesson|undefined{const i=this.selectedIndex;return i>=0&&i<this.allLessons.length-1?this.allLessons[i+1]:undefined;}
  get prerequisiteLessons():Lesson[]{const ids=this.selected?.unmetPrerequisiteLessonIds||[];return ids.map(id=>this.allLessons.find(l=>l.id===id)).filter((l):l is Lesson=>!!l);}
  get selectedModuleTitle():string{return this.data?.modules.find(m=>m.lessons.some(l=>l.id===this.selected?.id))?.title||'Learning module';}
  completedCount(m:CourseModule):number{return m.lessons.filter(l=>l.completed).length;}
  load(){this.loading=true;this.error='';this.learning.courseLearning(this.enrollmentId).subscribe({next:r=>{this.data=r.data;const all=this.allLessons;const requestedLessonId=this.route.snapshot.queryParamMap.get('lessonId');this.selected=(requestedLessonId?all.find(l=>l.id===requestedLessonId&&!l.locked):undefined)||all.find(l=>!l.completed&&!l.locked)||all[0];this.loading=false;this.loadAssessment();},error:e=>{this.loading=false;this.error=e?.error?.message||'We could not load this course right now.';}});}
  select(l:Lesson){if(l.locked)return;this.selected=l;this.error='';this.loadAssessment();window.scrollTo({top:0,behavior:'smooth'});}
  goToLesson(l:Lesson|undefined){if(!l||l.locked)return;this.select(l);}
  loadAssessment(){this.assessment=undefined;if(!this.selected)return;this.assessmentLoading=true;this.assessments.forLesson(this.selected.id).subscribe({next:r=>{this.assessment=r.data?.[0];this.assessmentLoading=false;},error:()=>{this.assessmentLoading=false;}});}
  openAssessment(){if(this.assessment)this.router.navigate(['/learner/quiz'],{queryParams:{assessmentId:this.assessment.id,mode:'adaptive',enrollmentId:this.enrollmentId,lessonId:this.selected?.id}});}
  complete(){if(!this.selected||this.selected.completed||this.selected.locked||this.completing)return;if(this.prerequisiteLessons.length)return;if(this.assessment&&!this.assessment.passed){this.openAssessment();return;}this.completing=true;this.error='';this.learning.completeLesson(this.enrollmentId,this.selected.id).subscribe({next:()=>{this.completing=false;this.load();},error:e=>{this.completing=false;this.error=e?.error?.message||'Unable to complete this lesson. Please try again.';}});}
  toggleTutor(){this.tutorOpen=!this.tutorOpen;this.tutorError='';}
  askTutor():void{const question=this.tutorQuestion.trim();if(!question||this.tutorLoading)return;this.tutorLoading=true;this.tutorError='';this.learning.respondToAiTutor(this.enrollmentId,question).subscribe({next:r=>{const answer=r.data?.response||'I could not generate an answer right now.';this.tutorResponse=r.data;this.tutorHistory=[...this.tutorHistory,{question,answer}];this.tutorQuestion='';this.tutorLoading=false;},error:()=>{this.tutorError='The AI Tutor is temporarily unavailable. Try again in a moment.';this.tutorLoading=false;}});}
  back(){this.router.navigateByUrl('/learner/courses');}
}
