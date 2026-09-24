import { Component, OnInit } from '@angular/core';
import { RoleRequest, RoleRequestService } from '../../../../core/services/role-request.service';

@Component({selector:'app-role-requests',templateUrl:'./role-requests.component.html',styleUrls:['./role-requests.component.scss']})
export class RoleRequestsComponent implements OnInit {
  requests: RoleRequest[]=[]; loading=true; processing=''; error=''; notice='';
  constructor(private readonly service:RoleRequestService){}
  ngOnInit():void{this.load();}
  load():void{this.loading=true;this.error='';this.service.pending().subscribe({next:r=>{this.requests=r.data||[];this.loading=false;},error:e=>{this.error=e?.error?.message||'Unable to load role requests.';this.loading=false;}});}
  approve(request:RoleRequest):void{if(this.processing)return;this.processing=request.id;this.service.approve(request.id).subscribe({next:()=>{this.notice=request.userName+' is now approved for '+request.requestedRole+'.';this.processing='';this.load();},error:e=>{this.processing='';this.error=e?.error?.message||e?.error?.error||'Unable to approve this request.';}});}
  reject(request:RoleRequest):void{if(this.processing)return;const reason=window.prompt('Optional rejection reason:','');if(reason===null)return;this.processing=request.id;this.service.reject(request.id,reason).subscribe({next:()=>{this.notice=request.userName+' request was rejected.';this.processing='';this.load();},error:e=>{this.processing='';this.error=e?.error?.message||e?.error?.error||'Unable to reject this request.';}});}
  trackById(_:number,request:RoleRequest):string{return request.id;}
  get teacherCount():number{return this.requests.filter(r=>r.requestedRole==='TEACHER'||r.requestedRole==='INSTRUCTOR').length;}
  get organizationCount():number{return this.requests.filter(r=>r.requestedRole==='ORG_ADMIN').length;}
}