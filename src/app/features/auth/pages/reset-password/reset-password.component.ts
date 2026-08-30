import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({selector:'app-reset-password',templateUrl:'./reset-password.component.html',styleUrls:['./reset-password.component.scss']})
export class ResetPasswordComponent implements OnInit {
 token=''; password=''; confirmPassword=''; loading=false; success=false; error='';
 constructor(private route:ActivatedRoute,private router:Router,private auth:AuthService){}
 ngOnInit():void{this.token=this.route.snapshot.queryParamMap.get('token')||''; if(!this.token)this.error='This password reset link is invalid.';}
 submit():void{if(!this.token||this.password.length<8||this.password!==this.confirmPassword||this.loading)return;this.loading=true;this.error='';
 this.auth.resetPassword(this.token,this.password).subscribe({next:()=>{this.success=true;this.loading=false;},error:e=>{this.error=e?.error?.message||'Unable to reset password.';this.loading=false;}});}
 login(){this.router.navigate(['/auth/login']);}
}