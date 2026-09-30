import { Component,OnInit } from '@angular/core'; import { Router } from '@angular/router'; import { PrivateTeacherService } from '../../../../core/services/private-teacher.service'; import { PrivateTeacherAvailability,PrivateTeacherMatch,PrivateTeacherOverview } from '../../../../core/models/private-teacher.model';
@Component({selector:'app-private-teacher',templateUrl:'./private-teacher.component.html',styleUrls:['./private-teacher.component.scss']})
export class PrivateTeacherComponent implements OnInit {
 overview:PrivateTeacherOverview|null=null; availability:PrivateTeacherAvailability[]=[]; matches:PrivateTeacherMatch[]=[]; loading=true;saving=false;matching=false;error=false;
 days=['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']; draft={dayOfWeek:'MONDAY',startTime:'09:00',endTime:'10:00',timezone:'Asia/Kolkata'}; criteria={subject:'',language:'',teachingMode:'',maxHourlyRate:null as number|null};
 constructor(private readonly service:PrivateTeacherService,private readonly router:Router){} ngOnInit(){this.load();}
 load(){this.loading=true;this.service.overview().subscribe({next:r=>{this.overview=r.data;this.loadAvailability()},error:()=>{this.error=true;this.loading=false}})}
 loadAvailability(){this.service.availability().subscribe({next:r=>{this.availability=r.data||[];this.loading=false},error:()=>{this.error=true;this.loading=false}})}
 addSlot(){if(this.draft.endTime<=this.draft.startTime)return;this.saving=true;this.service.addAvailability(this.draft).subscribe({next:r=>{this.availability=[...this.availability,r.data];this.saving=false},error:()=>{this.saving=false;this.error=true}})}
 findMatches(){this.matching=true;this.service.match(this.criteria).subscribe({next:r=>{this.matches=r.data||[];this.matching=false},error:()=>{this.matching=false;this.error=true}})}
 back(){this.router.navigateByUrl('/teacher');}
}