import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  showPassword = false;
  showConfirmPassword = false;
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  acceptedTerms = false;

  get passwordsMatch(): boolean {
    return !this.confirmPassword || this.password === this.confirmPassword;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  submit(): void {
    if (!this.passwordsMatch) {
      return;
    }

    // Registration API integration will be connected to the backend auth module.
    console.log('Registration requested', {
      fullName: this.fullName,
      email: this.email
    });
  }
}
