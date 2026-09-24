import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LearningPathCourse, LearningService } from '../../../../core/services/learning.service';

@Component({selector:'app-teacher-courses',templateUrl:'./teacher-courses.component.html',styleUrls:['./teacher-courses.component.scss']})
export class TeacherCoursesComponent implements OnInit {
  courses:LearningPathCourse[]=[]; loading=true; saving=false; publishing='';
  error=''; notice='';
  title=''; slug=''; description='';
  expandedCourse=''; expandedModule=''; moduleTitle=''; lessonTitle=''; lessonContent=''; lessonType='TEXT';
  selectedLessonId=''; prerequisiteTargetId=''; prerequisiteLessons:any[]=[]; assessmentTitle=''; assessmentPassingScore=70; assessmentLessonId='';
  constructor(private readonly learning:LearningService,private readonly router:Router){}
  ngOnInit():void{this.load();}
  load():void{this.loading=true;this.learning.adminLearningCatalog().subscribe({next:r=>{this.courses=r.data||[];this.loading=false;},error:()=>{this.error='Unable to load the course workspace.';this.loading=false;}});}
  createCourse():void{
    this.notice='';this.error='';
    if(!this.title.trim()||!this.slug.trim()){this.error='Course title and slug are required.';return;}
    this.saving=true;
    this.learning.createCourse({title:this.title.trim(),slug:this.slug.trim().toLowerCase(),description:this.description.trim()||undefined}).subscribe({
      next:r=>{this.saving=false;this.notice='Course created successfully.';this.title='';this.slug='';this.description='';this.load();if(r.data?.id)this.expandedCourse=r.data.id;},
      error:e=>{this.saving=false;this.error=e?.error?.message||'Course could not be created.';}
    });
  }
  addModule(course:LearningPathCourse):void{
    if(!this.moduleTitle.trim())return;
    const sortOrder=course.modules.length;
    this.learning.createModule(course.id,{title:this.moduleTitle.trim(),sortOrder}).subscribe({
      next:()=>{this.moduleTitle='';this.notice='Module added.';this.load();},
      error:()=>this.error='Module could not be added.'
    });
  }
  addLesson(module:any):void{
    if(!this.lessonTitle.trim())return;
    this.learning.createLesson(module.id,{title:this.lessonTitle.trim(),contentType:this.lessonType,content:this.lessonContent.trim()||undefined,sortOrder:module.lessons.length}).subscribe({
      next:()=>{this.lessonTitle='';this.lessonContent='';this.notice='Lesson added.';this.load();},
      error:()=>this.error='Lesson could not be added.'
    });
  }
  publish(course:LearningPathCourse):void{
    if(course.status==='PUBLISHED')return;
    this.publishing=course.id;this.error='';
    this.learning.publishCourse(course.id).subscribe({next:()=>{this.publishing='';this.notice='Course published.';this.load();},error:()=>{this.publishing='';this.error='Course could not be published.';}});
  }
  toggleCourse(id:string):void{this.expandedCourse=this.expandedCourse===id?'':id;}
  toggleModule(id:string):void{this.expandedModule=this.expandedModule===id?'':id;}
  totalLessons(course:LearningPathCourse):number{return course.modules.reduce((total,module)=>total+module.lessons.length,0);}
  beginLessonTools(lesson:any):void{this.selectedLessonId=lesson.id;this.assessmentLessonId=lesson.id;this.assessmentTitle='';this.prerequisiteTargetId='';this.loadPrerequisites(lesson);}
  loadPrerequisites(lesson:any):void{this.learning.getPrerequisites(lesson.id).subscribe({next:r=>this.prerequisiteLessons=r.data||[],error:()=>this.prerequisiteLessons=[]});}
  addPrerequisite(lesson:any):void{if(!this.prerequisiteTargetId||this.prerequisiteTargetId===lesson.id)return;this.learning.addPrerequisite(lesson.id,this.prerequisiteTargetId).subscribe({next:()=>{this.notice='Prerequisite added.';this.loadPrerequisites(lesson);},error:e=>this.error=e?.error?.message||'Unable to add prerequisite.'});}
  removePrerequisite(lesson:any,prerequisite:any):void{this.learning.removePrerequisite(lesson.id,prerequisite.id).subscribe({next:()=>{this.notice='Prerequisite removed.';this.loadPrerequisites(lesson);},error:e=>this.error=e?.error?.message||'Unable to remove prerequisite.'});}
  createLessonAssessment():void{if(!this.assessmentLessonId||!this.assessmentTitle.trim())return;this.learning.createLessonAssessment(this.assessmentLessonId,{title:this.assessmentTitle.trim(),passingScore:this.assessmentPassingScore}).subscribe({next:()=>{this.notice='Lesson assessment created and completion gate enabled.';this.assessmentTitle='';this.load();},error:e=>this.error=e?.error?.message||'Unable to create lesson assessment.'});}
  setCompletionMode(lesson:any,completionMode:string):void{
    if(lesson.completionMode===completionMode)return;
    this.learning.updateLessonCompletionMode(lesson.id,completionMode).subscribe({
      next:()=>{lesson.completionMode=completionMode;this.notice='Lesson completion requirement updated.';this.error='';},
      error:e=>{this.error=e?.error?.message||'Unable to update lesson completion requirement.';}
    });
  }
  back():void{this.router.navigateByUrl('/teacher');}
}