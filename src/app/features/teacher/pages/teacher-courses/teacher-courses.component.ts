import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LearningPathCourse, LearningService } from '../../../../core/services/learning.service';

@Component({selector:'app-teacher-courses',templateUrl:'./teacher-courses.component.html',styleUrls:['./teacher-courses.component.scss']})
export class TeacherCoursesComponent implements OnInit {
  courses:LearningPathCourse[]=[]; loading=true; saving=false; publishing='';
  error=''; notice='';
  title=''; slug=''; description='';
  expandedCourse=''; expandedModule=''; moduleTitle=''; lessonTitle=''; lessonContent=''; lessonType='TEXT';
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
  back():void{this.router.navigateByUrl('/teacher');}
}