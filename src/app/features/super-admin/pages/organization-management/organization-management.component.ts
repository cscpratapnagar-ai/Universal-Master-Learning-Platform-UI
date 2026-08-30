import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../../core/services/organization.service';
import { CreateOrganizationRequest, Organization } from '../../../../core/models/organization.model';

@Component({selector:'app-organization-management',templateUrl:'./organization-management.component.html',styleUrls:['./organization-management.component.scss']})
export class OrganizationManagementComponent implements OnInit {
  organizations: Organization[]=[]; filtered: Organization[]=[]; loading=true; errorMessage=''; search=''; showCreate=false; saving=false;
  form: CreateOrganizationRequest={code:'',name:'',description:''};
  constructor(private readonly organizationService: OrganizationService){}
  ngOnInit():void{this.load();}
  load():void{this.loading=true;this.organizationService.getAll().subscribe({next:r=>{this.organizations=r.data||[];this.applyFilter();this.loading=false;},error:e=>{this.errorMessage=e.message||'Unable to load organizations';this.loading=false;}});}
  applyFilter():void{const q=this.search.toLowerCase().trim();this.filtered=this.organizations.filter(o=>!q||o.name.toLowerCase().includes(q)||o.code.toLowerCase().includes(q));}
  create():void{if(!this.form.code.trim()||!this.form.name.trim())return;this.saving=true;this.organizationService.create(this.form).subscribe({next:()=>{this.saving=false;this.showCreate=false;this.form={code:'',name:'',description:''};this.load();},error:e=>{this.saving=false;this.errorMessage=e.message||'Unable to create organization';}});}
  deactivate(org:Organization):void{if(!confirm(`Deactivate ${org.name}?`))return;this.organizationService.deactivate(org.id).subscribe({next:()=>this.load(),error:e=>this.errorMessage=e.message||'Unable to update organization'});}
  get activeCount():number{return this.organizations.filter(x=>x.active).length;}
}