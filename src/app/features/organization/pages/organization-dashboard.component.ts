import {Component,OnInit} from '@angular/core';import {FormBuilder,Validators} from '@angular/forms';import {Organization,OrganizationProfile,OrganizationStatus,OrganizationMember} from '../../../core/models/organization.model';import {OrganizationService} from '../../../core/services/organization.service';@Component({selector:'app-organization-dashboard',templateUrl:'./organization-dashboard.component.html',styleUrls:['./organization-dashboard.component.scss']}) export class OrganizationDashboardComponent implements OnInit{profile:OrganizationProfile|null=null;organizations:Organization[]=[];members:OrganizationMember[]=[];loading=false;saving=false;memberLoading=false;memberSaving=false;error='';success='';memberEmail='';statuses:OrganizationStatus[]=['DRAFT','ACTIVE','SUSPENDED','INACTIVE','ARCHIVED'];form=this.fb.group({organizationId:['',Validators.required],slug:[''],legalName:[''],displayName:[''],organizationType:[''],registrationNumber:[''],establishedDate:[''],primaryEmail:['',Validators.email],primaryPhone:[''],alternatePhone:[''],website:[''],addressLine:[''],country:[''],state:[''],city:[''],district:[''],postalCode:[''],logoUrl:[''],coverImageUrl:[''],primaryColor:[''],secondaryColor:['']});constructor(private fb:FormBuilder,private org:OrganizationService){}

ngOnInit():void{
  this.org.getMine().subscribe({
    next:r=>{
      this.organizations=r.data||[];
      if(this.organizations.length===1){
        this.form.controls.organizationId.setValue(this.organizations[0].id);
        this.load();
      } else if(this.organizations.length>1){
        this.error='Select an organization workspace below.';
      } else {
        this.error='No organization workspace is assigned to this account yet. If your organization-admin request was just approved, sign out and sign in again once.';
      }
    },
    error:e=>{
      this.error=e?.error?.message||'Unable to load your organization workspace.';
    }
  });
}

selectOrganization(id:string):void{this.form.controls.organizationId.setValue(id);this.load();}

load(){const id=this.form.controls.organizationId.value;if(!id)return;this.loading=true;this.memberLoading=true;this.org.getProfile(id).subscribe({next:r=>{this.profile=r.data||null;this.loading=false;if(this.profile)this.form.patchValue(this.profile)},error:e=>{this.error=e?.error?.message||'Unable to load organization';this.loading=false}});this.org.getMembers(id).subscribe({next:r=>{this.members=r.data||[];this.memberLoading=false},error:e=>{this.error=e?.error?.message||'Unable to load organization members';this.memberLoading=false}})}save(){if(!this.profile)return;this.saving=true;const {organizationId,...raw}=this.form.getRawValue();const body=Object.fromEntries(Object.entries(raw).map(([key,value])=>[key,value??undefined]));this.org.updateProfile(this.profile.id,body).subscribe({next:r=>{this.profile=r.data||this.profile;this.success='Profile saved';this.saving=false},error:e=>{this.error=e?.error?.message||'Unable to save';this.saving=false}})}changeStatus(status:OrganizationStatus){if(!this.profile)return;this.org.updateStatus(this.profile.id,status).subscribe({next:r=>this.profile=r.data||this.profile,error:e=>this.error=e?.error?.message||'Unable to update status'})}
inviteMember():void{if(!this.profile||!this.memberEmail.trim())return;this.memberSaving=true;this.error='';this.org.inviteMember(this.profile.id,this.memberEmail.trim()).subscribe({next:()=>{this.memberEmail='';this.success='Member added to the organization.';this.memberSaving=false;this.load()},error:e=>{this.error=e?.error?.message||'Unable to add this member.';this.memberSaving=false}})}
deactivateMember(member:OrganizationMember):void{if(!this.profile)return;this.org.deactivateMember(this.profile.id,member.id).subscribe({next:()=>{this.success='Member deactivated.';this.load()},error:e=>this.error=e?.error?.message||'Unable to deactivate member.'})}
}}