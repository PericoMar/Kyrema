import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  errorMessage = "";
  loadingLogin = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,  
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loadingLogin = true;
      const { username, password } = this.loginForm.value;
      this.authService.loginUser(username, password).subscribe(
        success => {
          if (success) {
            this.router.navigate(['']); // Cambia esto por la ruta de tu dashboard
          } else {
            this.errorMessage = 'Credenciales incorrectas';
            this.loadingLogin = false;
          }
        },
        error => {
          this.errorMessage = 'Ocurrió un error. Por favor, inténtalo de nuevo.';
        }
      );
    }
  }
}
