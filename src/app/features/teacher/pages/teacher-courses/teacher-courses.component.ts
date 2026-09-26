import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LearningPathCourse, LearningService } from '../../../../core/services/learning.service';

@Component({
  selector:'app-teacher-courses',
  templateUrl:'./teacher-courses.component.html',
  styleUrls:['./teacher-courses.component.scss']
})
export class TeacherCoursesComponent implements OnInit {
  courses:LearningPathCourse[]=[];
  loading=true;
  saving=false;
  publishing='';
  error='';
  notice='';
  organizationId='';

  title='';
  slug='';
  description='';

  expandedCourse='';
  expandedModule='';
  moduleTitle='';
  lessonTitle='';
  lessonContent='';
  lessonType='TEXT';

  selectedLessonId='';
  prerequisiteTargetId='';
  prerequisiteLessons:any[]=[];
  assessmentTitle='';
  assessmentPassingScore=70;
  assessmentLessonId='';

  editingCourseId='';
  editCourseTitle='';
  editCourseSlug='';
  editCourseDescription='';

  editingModuleId='';
  editModuleTitle='';
  editModuleSortOrder=0;

  editingLessonId='';
  editLessonTitle='';
  editLessonContent='';
  editLessonType='TEXT';
  editLessonSortOrder=0;

  constructor(private readonly learning:LearningService,private readonly router:Router,private readonly route:ActivatedRoute){}

  ngOnInit():void{this.organizationId=this.route.snapshot.queryParamMap.get('organizationId')||'';this.load();}

  load():void{
    this.loading=true;
    this.learning.adminLearningCatalog(this.organizationId||undefined).subscribe({
      next:r=>{this.courses=r.data||[];this.loading=false;},
      error:()=>{this.error='Unable to load the course workspace.';this.loading=false;}
    });
  }

  createCourse():void{
    this.notice='';this.error='';
    if(!this.title.trim()||!this.slug.trim()){this.error='Course title and slug are required.';return;}
    this.saving=true;
    this.learning.createCourse({
      title:this.title.trim(),
      slug:this.slug.trim().toLowerCase(),
      description:this.description.trim()||undefined,
      organizationId:this.organizationId||undefined
    }).subscribe({
      next:r=>{
        this.saving=false;
        this.notice='Course created successfully.';
        this.title='';this.slug='';this.description='';
        this.load();
        if(r.data?.id)this.expandedCourse=r.data.id;
      },
      error:e=>{this.saving=false;this.error=e?.error?.message||'Course could not be created.';}
    });
  }

  startCourseEdit(course:LearningPathCourse):void{
    this.editingCourseId=course.id;
    this.editCourseTitle=course.title;
    this.editCourseSlug=course.slug||'';
    this.editCourseDescription=course.description||'';
    this.error='';
  }

  cancelCourseEdit():void{this.editingCourseId='';}

  saveCourseEdit(course:LearningPathCourse):void{
    if(!this.editCourseTitle.trim()||!this.editCourseSlug.trim()){
      this.error='Course title and slug are required.';
      return;
    }
    this.saving=true;this.error='';
    this.learning.updateCourse(course.id,{
      title:this.editCourseTitle.trim(),
      slug:this.editCourseSlug.trim().toLowerCase(),
      description:this.editCourseDescription.trim()||undefined,
      organizationId:course.organizationId||this.organizationId||undefined
    }).subscribe({
      next:()=>{
        this.saving=false;
        this.notice='Course details updated.';
        this.editingCourseId='';
        this.load();
      },
      error:e=>{this.saving=false;this.error=e?.error?.message||'Course could not be updated.';}
    });
  }

  addModule(course:LearningPathCourse):void{
    if(!this.moduleTitle.trim())return;
    const sortOrder=course.modules.length;
    this.learning.createModule(course.id,{title:this.moduleTitle.trim(),sortOrder}).subscribe({
      next:()=>{this.moduleTitle='';this.notice='Module added.';this.load();},
      error:e=>this.error=e?.error?.message||'Module could not be added.'
    });
  }

  startModuleEdit(module:any):void{
    this.editingModuleId=module.id;
    this.editModuleTitle=module.title;
    this.editModuleSortOrder=module.sortOrder;
  }

  cancelModuleEdit():void{this.editingModuleId='';}

  saveModuleEdit(module:any):void{
    if(!this.editModuleTitle.trim()){this.error='Module title is required.';return;}
    this.learning.updateModule(module.id,{
      title:this.editModuleTitle.trim(),
      sortOrder:Number(this.editModuleSortOrder)||0
    }).subscribe({
      next:()=>{this.notice='Module updated.';this.editingModuleId='';this.load();},
      error:e=>this.error=e?.error?.message||'Module could not be updated.'
    });
  }

  addLesson(module:any):void{
    if(!this.lessonTitle.trim())return;
    this.learning.createLesson(module.id,{
      title:this.lessonTitle.trim(),
      contentType:this.lessonType,
      content:this.lessonContent.trim()||undefined,
      sortOrder:module.lessons.length
    }).subscribe({
      next:()=>{this.lessonTitle='';this.lessonContent='';this.notice='Lesson added.';this.load();},
      error:e=>this.error=e?.error?.message||'Lesson could not be added.'
    });
  }

  startLessonEdit(lesson:any):void{
    this.editingLessonId=lesson.id;
    this.editLessonTitle=lesson.title;
    this.editLessonContent=lesson.content||'';
    this.editLessonType=lesson.contentType||'TEXT';
    this.editLessonSortOrder=lesson.sortOrder;
  }

  cancelLessonEdit():void{this.editingLessonId='';}

  saveLessonEdit(lesson:any):void{
    if(!this.editLessonTitle.trim()){this.error='Lesson title is required.';return;}
    this.learning.updateLesson(lesson.id,{
      title:this.editLessonTitle.trim(),
      contentType:this.editLessonType,
      content:this.editLessonContent.trim()||undefined,
      sortOrder:Number(this.editLessonSortOrder)||0
    }).subscribe({
      next:()=>{this.notice='Lesson updated.';this.editingLessonId='';this.load();},
      error:e=>this.error=e?.error?.message||'Lesson could not be updated.'
    });
  }

  publish(course:LearningPathCourse):void{
    if(course.status==='PUBLISHED')return;
    this.publishing=course.id;this.error='';
    this.learning.publishCourse(course.id).subscribe({
      next:()=>{this.publishing='';this.notice='Course published.';this.load();},
      error:e=>{this.publishing='';this.error=e?.error?.message||'Course could not be published.';}
    });
  }

  archive(course:LearningPathCourse):void{
    if(course.status==='ARCHIVED')return;
    this.learning.archiveCourse(course.id).subscribe({
      next:()=>{this.notice='Course archived.';this.load();},
      error:e=>this.error=e?.error?.message||'Course could not be archived.'
    });
  }

  toggleCourse(id:string):void{this.expandedCourse=this.expandedCourse===id?'':id;}
  toggleModule(id:string):void{this.expandedModule=this.expandedModule===id?'':id;}
  totalLessons(course:LearningPathCourse):number{return course.modules.reduce((total,module)=>total+module.lessons.length,0);}

  publishChecks(course:LearningPathCourse):{label:string;ready:boolean}[]{
    return [
      {label:'Course title',ready:!!course.title?.trim()},
      {label:'Description',ready:!!course.description?.trim()},
      {label:'At least one module',ready:course.modules.length>0},
      {label:'At least one lesson',ready:this.totalLessons(course)>0},
      {label:'Lesson content',ready:course.modules.every(module=>module.lessons.every(lesson=>!!lesson.content?.trim()))}
    ];
  }

  publishReady(course:LearningPathCourse):boolean{
    return this.publishChecks(course).every(check=>check.ready);
  }

  beginLessonTools(lesson:any):void{
    this.selectedLessonId=lesson.id;
    this.assessmentLessonId=lesson.id;
    this.assessmentTitle='';
    this.prerequisiteTargetId='';
    this.loadPrerequisites(lesson);
  }

  loadPrerequisites(lesson:any):void{
    this.learning.getPrerequisites(lesson.id).subscribe({
      next:r=>this.prerequisiteLessons=r.data||[],
      error:()=>this.prerequisiteLessons=[]
    });
  }

  addPrerequisite(lesson:any):void{
    if(!this.prerequisiteTargetId||this.prerequisiteTargetId===lesson.id)return;
    this.learning.addPrerequisite(lesson.id,this.prerequisiteTargetId).subscribe({
      next:()=>{this.notice='Prerequisite added.';this.loadPrerequisites(lesson);},
      error:e=>this.error=e?.error?.message||'Unable to add prerequisite.'
    });
  }

  removePrerequisite(lesson:any,prerequisite:any):void{
    this.learning.removePrerequisite(lesson.id,prerequisite.id).subscribe({
      next:()=>{this.notice='Prerequisite removed.';this.loadPrerequisites(lesson);},
      error:e=>this.error=e?.error?.message||'Unable to remove prerequisite.'
    });
  }

  createLessonAssessment():void{
    if(!this.assessmentLessonId||!this.assessmentTitle.trim())return;
    this.learning.createLessonAssessment(this.assessmentLessonId,{
      title:this.assessmentTitle.trim(),
      passingScore:this.assessmentPassingScore
    }).subscribe({
      next:()=>{
        this.learning.updateLessonCompletionMode(this.assessmentLessonId,'ASSESSMENT_REQUIRED').subscribe({
          next:()=>{this.notice='Lesson assessment created and assessment completion gate enabled.';this.assessmentTitle='';this.load();},
          error:e=>{this.error=e?.error?.message||'Assessment was created, but the lesson completion gate could not be enabled.';this.assessmentTitle='';this.load();}
        });
      },
      error:e=>this.error=e?.error?.message||'Unable to create lesson assessment.'
    });
  }

  setCompletionMode(lesson:any,completionMode:string):void{
    if(lesson.completionMode===completionMode)return;
    this.learning.updateLessonCompletionMode(lesson.id,completionMode).subscribe({
      next:()=>{lesson.completionMode=completionMode;this.notice='Lesson completion requirement updated.';this.error='';},
      error:e=>{this.error=e?.error?.message||'Unable to update lesson completion requirement.';}
    });
  }

  back():void{this.router.navigateByUrl('/teacher');}
}
