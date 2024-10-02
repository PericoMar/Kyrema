import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppConfig } from '../../../config/app-config';
import { AuthService } from '../../services/auth.service';
import { NavService } from '../../services/nav.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomValidators } from '../../validators/custom-validators';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  changePwdForm: FormGroup;
  hidePassword = true;
  errorMessage = "";
  successMessage = "";
  loadingChangePwd = false;
  loginRoute: string;
  passwordChanged: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,  
    private navService : NavService,
    private route : ActivatedRoute
  ) {

    this.loadingChangePwd = false;
    this.changePwdForm = this.fb.group({
      email : ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.passwordValidator]],
      password_confirmation: ['', [Validators.required]],
      token: ['']
    }, { validators: this.passwordMatchValidator });
    
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.changePwdForm.controls['email'].setValue(params['email']);
      }
    });

    this.route.paramMap.subscribe(params => {
      this.changePwdForm.controls['token'].setValue(params.get('token'));
    });

      this.loginRoute = AppConfig.URL + '/login';
    }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.changePwdForm.valid) {
      this.loadingChangePwd = true;
      const email = this.changePwdForm.value.email;
      const password = this.changePwdForm.value.password;
      const password_confirmation = this.changePwdForm.value.password_confirmation;
      const token = this.changePwdForm.value.token;
      console.log('Email:', email, 'Password:', password, 'Password Confirmation:', password_confirmation, 'Token:', token);
      this.authService.changePwd(email, password, password_confirmation, token ).subscribe({
        next: () => {
          console.log('Password changed successfully');
          this.passwordChanged = true;
          setTimeout(() => {
            this.router.navigate(['/login'])
          }, 6000);
        },
        error: (error) => {
          console.error('Error sending reset password email:', error);
          this.errorMessage = 'Error al reestablecer la contraseña. Por favor, contacte con soporte.';
        },
        complete: () => {
          this.loadingChangePwd = false;
        }
      });
    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('password')?.value === formGroup.get('password_confirmation')?.value
        ? null : { passwordMismatch: true };
}
}
