import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrivateTeacherService } from '../../../../core/services/private-teacher.service';
import { PrivateTeacherAvailability, PrivateTeacherMatch, PrivateTeacherSession, PrivateTeacherSessionRequest } from '../../../../core/models/private-teacher.model';

interface Slot { label:string; startsAt:string; endsAt:string; }

@Component({selector:'app-private-teachers',templateUrl:'./private-teachers.component.html',styleUrls:['./private-teachers.component.scss']})
export class PrivateTeachersComponent implements OnInit {
  matches:PrivateTeacherMatch[]=[]; sessions:PrivateTeacherSession[]=[]; availability:PrivateTeacherAvailability[]=[];
  selected:PrivateTeacherMatch|null=null; slots:Slot[]=[]; selectedSlot:Slot|null=null;
  loading=false; availabilityLoading=false; booking=false; message=''; error='';
  criteria={subject:'',language:'',teachingMode:'',maxHourlyRate:null as number|null};
  selectedDate=this.tomorrowIso(); duration=60; topic=''; notes='';

  constructor(private readonly service:PrivateTeacherService,private readonly router:Router){}
  ngOnInit():void{this.search();this.loadSessions();}

  search():void{
    this.loading=true;this.error='';this.message='';
    this.service.match(this.criteria).subscribe({
      next:r=>{this.matches=r.data||[];this.loading=false; if(this.selected){this.selected=this.matches.find(m=>m.teacherId===this.selected?.teacherId)||null;if(this.selected)this.loadAvailability(this.selected);}},
      error:()=>{this.loading=false;this.error='Private teachers could not be loaded right now.';}
    });
  }

  selectTeacher(teacher:PrivateTeacherMatch):void{
    this.selected=teacher;this.selectedSlot=null;this.topic=this.topic||('Private '+(teacher.subjects?.split(',')[0]||'learning')+' session');this.loadAvailability(teacher);
  }

  loadAvailability(teacher:PrivateTeacherMatch):void{
    this.availabilityLoading=true;this.error='';this.availability=[];this.slots=[];
    this.service.teacherAvailability(teacher.teacherId).subscribe({
      next:r=>{this.availability=r.data||[];this.availabilityLoading=false;this.buildSlots();},
      error:()=>{this.availabilityLoading=false;this.error='Teacher availability could not be loaded.';}
    });
  }

  onDateChange():void{this.selectedSlot=null;this.buildSlots();}
  onDurationChange():void{this.selectedSlot=null;this.buildSlots();}

  buildSlots():void{
    this.slots=[];if(!this.selected||!this.selectedDate||!this.availability.length)return;
    const day=this.dayName(this.selectedDate);const windows=this.availability.filter(a=>a.dayOfWeek===day);const now=Date.now();
    for(const window of windows){
      let cursor=this.toMinutes(window.startTime);const end=this.toMinutes(window.endTime);
      while(cursor+this.duration<=end){
        const startTime=this.fromMinutes(cursor);const endTime=this.fromMinutes(cursor+this.duration);
        const startsAt=this.zonedInstant(this.selectedDate,startTime,window.timezone);const endsAt=this.zonedInstant(this.selectedDate,endTime,window.timezone);
        if(new Date(startsAt).getTime()>now)this.slots.push({label:startTime+' – '+endTime,startsAt,endsAt});
        cursor+=30;
      }
    }
  }

  requestBooking():void{
    if(!this.selected||!this.selectedSlot||this.booking)return;
    const request:PrivateTeacherSessionRequest={
      teacherId:this.selected.teacherId,startsAt:this.selectedSlot.startsAt,endsAt:this.selectedSlot.endsAt,
      timezone:this.timezoneForSelectedSlot(),topic:this.topic.trim()||null,notes:this.notes.trim()||null
    };
    this.booking=true;this.error='';this.message='';
    this.service.requestSession(request).subscribe({
      next:r=>{this.booking=false;this.message='Request sent. Status: '+r.data.status+'.';this.loadSessions();this.selectedSlot=null;},
      error:err=>{this.booking=false;this.error=err?.error?.message||err?.error?.data?.message||'Booking request could not be created. Please choose another slot.';this.buildSlots();}
    });
  }

  loadSessions():void{this.service.sessions().subscribe({next:r=>this.sessions=(r.data||[]).filter(s=>!!s.learnerId),error:()=>undefined});}
  back():void{this.router.navigateByUrl('/learner');}
  trackByTeacher(_:number,item:PrivateTeacherMatch):string{return item.teacherId;}
  trackBySlot(_:number,item:Slot):string{return item.startsAt;}

  private timezoneForSelectedSlot():string{
    const slot=this.availability.find(a=>a.dayOfWeek===this.dayName(this.selectedDate));
    return slot?.timezone||Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC';
  }
  private dayName(iso:string):string{const days=['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];return days[new Date(iso+'T12:00:00').getDay()];}
  private toMinutes(value:string):number{const [h,m]=value.split(':').map(Number);return h*60+m;}
  private fromMinutes(value:number):string{return String(Math.floor(value/60)).padStart(2,'0')+':'+String(value%60).padStart(2,'0');}
  private tomorrowIso():string{const d=new Date();d.setDate(d.getDate()+1);return d.toISOString().slice(0,10);}
  private zonedInstant(date:string,time:string,timeZone:string):string{
    const [y,m,d]=date.split('-').map(Number);const [hh,mm]=time.split(':').map(Number);let guess=Date.UTC(y,m-1,d,hh,mm);
    for(let i=0;i<2;i++){
      const parts=new Intl.DateTimeFormat('en-US',{timeZone,hour12:false,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'}).formatToParts(new Date(guess));
      const map=Object.fromEntries(parts.filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
      const asUtc=Date.UTC(Number(map.year),Number(map.month)-1,Number(map.day),Number(map.hour)%24,Number(map.minute),Number(map.second));
      guess+=Date.UTC(y,m-1,d,hh,mm)-asUtc;
    }
    return new Date(guess).toISOString();
  }
}