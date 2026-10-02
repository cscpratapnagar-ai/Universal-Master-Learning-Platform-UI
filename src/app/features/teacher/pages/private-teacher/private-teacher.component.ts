import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrivateTeacherService } from '../../../../core/services/private-teacher.service';
import { PrivateTeacherAvailability,PrivateTeacherMatch,PrivateTeacherOverview,PrivateTeacherProfile,PrivateTeacherSession } from '../../../../core/models/private-teacher.model';

@Component({selector:'app-private-teacher',templateUrl:'./private-teacher.component.html',styleUrls:['./private-teacher.component.scss']})
export class PrivateTeacherComponent implements OnInit{
overview:PrivateTeacherOverview|null=null;profileData:PrivateTeacherProfile={headline:'',bio:'',subjects:'',teachingModes:'',languages:'',hourlyRate:null,currency:'INR',acceptingLearners:true};availability:PrivateTeacherAvailability[]=[];matches:PrivateTeacherMatch[]=[];sessions:PrivateTeacherSession[]=[];loading=true;matching=false;saving=false;profileSaving=false;profileLoaded=false;error=false;profileMessage='';
days=['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'];
draft={dayOfWeek:'MONDAY',startTime:'09:00',endTime:'10:00',timezone:'Asia/Kolkata'};
criteria={subject:'',language:'',teachingMode:'',maxHourlyRate:null as number|null};
constructor(private readonly service:PrivateTeacherService,private readonly router:Router){}
ngOnInit(){this.load();}
load(){this.loading=true;this.error=false;this.service.overview().subscribe({next:r=>{this.overview=r.data;this.loadProfile();this.loadAvailability();this.loadSessions()},error:()=>{this.error=true;this.loading=false}})}
loadProfile(){this.service.profile().subscribe({next:r=>{if(r.data)this.profileData={...this.profileData,...r.data};this.profileLoaded=true},error:()=>{this.profileLoaded=true}})}
loadAvailability(){this.service.availability().subscribe({next:r=>{this.availability=r.data||[];this.loading=false},error:()=>{this.error=true;this.loading=false}})}
loadSessions(){this.service.teacherSessions().subscribe({next:r=>this.sessions=r.data||[],error:()=>this.error=true})}
saveProfile(){this.profileSaving=true;this.profileMessage='';this.service.saveProfile(this.profileData).subscribe({next:r=>{this.profileData={...this.profileData,...r.data};this.profileSaving=false;this.profileMessage='Profile saved successfully.'},error:()=>{this.profileSaving=false;this.profileMessage='Could not save profile. Please try again.'}})}
addSlot(){if(this.draft.endTime<=this.draft.startTime)return;this.saving=true;this.service.addAvailability(this.draft).subscribe({next:r=>{this.availability=[...this.availability,r.data];this.saving=false},error:()=>{this.saving=false;this.error=true}})}
findMatches(){this.matching=true;this.service.match(this.criteria).subscribe({next:r=>{this.matches=r.data||[];this.matching=false},error:()=>{this.matching=false;this.error=true}})}
action(id:string,kind:'confirm'|'cancel'|'complete'){const call=kind==='confirm'?this.service.confirm(id):kind==='cancel'?this.service.cancel(id):this.service.complete(id);call.subscribe({next:()=>this.loadSessions(),error:()=>this.error=true})}
back(){this.router.navigateByUrl('/teacher');}
}