import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NavService } from '../../services/nav.service';
import { MatIconModule } from '@angular/material/icon';
import { AppConfig } from '../../../config/app-config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule, RouterModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetPwdForm: FormGroup;
  hidePassword = true;
  errorMessage = "";
  successMessage = "";
  loadingResetPwd = false;
  loginRoute: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,  
    private navService : NavService
  ) {

    this.loadingResetPwd = false;
    this.resetPwdForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.loginRoute = AppConfig.URL + '/login';
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.resetPwdForm.valid) {
      this.loadingResetPwd = true;
      this.authService.resetPwd(this.resetPwdForm.value.email).subscribe({
        next: () => {
          console.log('Reset password email sent');
          this.successMessage = "Se ha enviado un correo con las instrucciones para restablecer la contraseña.";
        },
        error: (error) => {
          console.error('Error sending reset password email:', error);
          this.errorMessage = 'Error al enviar el correo de restablecimiento de contraseña. Compruebe que este es el correo electrónico registrado.';
        },
        complete: () => {
          this.loadingResetPwd = false;
        }
      });
    }
  }
}
