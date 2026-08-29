import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  showPassword = false;
  rememberMe = true;
  email = '';
  password = '';

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    // Authentication API integration will be connected to the backend auth module.
    console.log('Login requested', { email: this.email, rememberMe: this.rememberMe });
  }
}
