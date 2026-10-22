import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrivateTeacherService } from '../../../../core/services/private-teacher.service';
import { PrivateTeacherAvailability,PrivateTeacherMatch,PrivateTeacherOverview,PrivateTeacherProfile,PrivateTeacherSession } from '../../../../core/models/private-teacher.model';

@Component({selector:'app-private-teacher',templateUrl:'./private-teacher.component.html',styleUrls:['./private-teacher.component.scss']})
export class PrivateTeacherComponent implements OnInit{
overview:PrivateTeacherOverview|null=null;profileData:PrivateTeacherProfile={headline:'',bio:'',subjects:'',teachingModes:'',languages:'',hourlyRate:null,currency:'INR',acceptingLearners:true};availability:PrivateTeacherAvailability[]=[];matches:PrivateTeacherMatch[]=[];sessions:PrivateTeacherSession[]=[];loading=true;matching=false;saving=false;profileSaving=false;profileLoaded=false;error=false;profileMessage='';actionMessage='';availabilityActionId:string|null=null;availabilityMessage='';sessionActionId:string|null=null;
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
addSlot(){
 this.availabilityMessage='';
 if(this.draft.endTime<=this.draft.startTime){this.availabilityMessage='End time must be later than start time.';return;}
 const overlaps=this.availability.some(slot=>slot.active&&slot.dayOfWeek===this.draft.dayOfWeek&&slot.timezone===this.draft.timezone&&this.draft.startTime<slot.endTime&&this.draft.endTime>slot.startTime);
 if(overlaps){this.availabilityMessage='This window overlaps an existing active window for the same day and timezone.';return;}
 this.saving=true;
 this.service.addAvailability(this.draft).subscribe({
  next:r=>{this.availability=[...this.availability,r.data].sort((a,b)=>this.days.indexOf(a.dayOfWeek)-this.days.indexOf(b.dayOfWeek)||a.startTime.localeCompare(b.startTime));this.saving=false;this.availabilityMessage='Availability window added.';},
  error:err=>{this.saving=false;this.availabilityMessage=err?.error?.message||'Could not add availability. Please try again.';}
 });
}
disableSlot(slot:PrivateTeacherAvailability){
 if(!slot.id||this.availabilityActionId)return;
 this.availabilityActionId=slot.id;this.availabilityMessage='';
 this.service.disableAvailability(slot.id).subscribe({
  next:()=>{this.availability=this.availability.filter(item=>item.id!==slot.id);this.availabilityActionId=null;this.availabilityMessage='Availability window removed.';},
  error:err=>{this.availabilityActionId=null;this.availabilityMessage=err?.error?.message||'Could not remove this availability window. Please try again.';}
 });
}
findMatches(){this.matching=true;this.service.match(this.criteria).subscribe({next:r=>{this.matches=r.data||[];this.matching=false},error:()=>{this.matching=false;this.error=true}})}
action(id:string,kind:'confirm'|'cancel'|'complete'){
 if(!id||this.sessionActionId)return;
 this.sessionActionId=id;
 const call=kind==='confirm'?this.service.confirm(id):kind==='cancel'?this.service.cancel(id):this.service.complete(id);
 call.subscribe({
  next:()=>{this.sessionActionId=null;this.actionMessage=kind==='confirm'?'Session confirmed.':kind==='cancel'?'Session cancelled.':'Session marked completed.';this.loadSessions();},
  error:err=>{this.sessionActionId=null;this.error=true;const detail=String(err?.error?.message||err?.error?.data?.message||'');this.actionMessage=err?.status===409||/state|already|overlap|conflict/i.test(detail)?(detail||'This session changed before the action completed. Refresh the session list and try again.'):(detail||'Session action could not be completed. Please try again.');this.loadSessions();}
 });
}
back(){this.router.navigateByUrl('/teacher');}
}