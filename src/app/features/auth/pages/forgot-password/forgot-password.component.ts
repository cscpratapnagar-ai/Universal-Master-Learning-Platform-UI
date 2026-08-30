import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeMode, ThemeService } from '../../../../core/services/theme.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({selector:'app-forgot-password',templateUrl:'./forgot-password.component.html',styleUrls:['./forgot-password.component.scss']})
export class ForgotPasswordComponent {
  theme: ThemeMode = 'dark'; email=''; loading=false; sent=false; error='';
  constructor(private auth:AuthService, private router:Router, themeService:ThemeService){themeService.theme$.subscribe(t=>this.theme=t);}
  submit():void{ if(!this.email||this.loading)return; this.loading=true; this.error='';
    this.auth.forgotPassword(this.email).subscribe({next:()=>{this.sent=true;this.loading=false;},error:e=>{this.error=e?.error?.message||'Unable to process request.';this.loading=false;}});
  }
  goLogin(){this.router.navigate(['/auth/login']);}
}