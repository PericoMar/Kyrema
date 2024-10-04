import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatIconModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  errorMessage = "";
  loadingLogin = false;
  currentRoute: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,  
    private navService : NavService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.currentRoute = this.router.url;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loadingLogin = true;
      const { username, password } = this.loginForm.value;
      this.authService.loginUser(username, password).subscribe(
        comercial => {
          if (comercial) {
            this.navService.getNavegation(comercial.id_sociedad).subscribe(
              data => {
                //Navega a la primera pagina dentro de operaciones:
                if(data.length > 0 && data[data.length-1].children.length > 0){
                  setTimeout(() => {
                  this.router.navigate([`${data[data.length-1].children[0].link}`]);  
                  }, 1000);
                } else {
                  this.router.navigate(['/gestion-productos']);
                }
                
              },
              error => {
                this.errorMessage = 'Ocurrió un error. Por favor, inténtalo de nuevo.';
              }
            );
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
