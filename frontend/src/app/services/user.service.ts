import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USER_KEY = 'currentUser';
  private loginUrl = '/api/auth/login'; // Actualiza esta URL con la ruta de tu backend

  constructor(private http: HttpClient) { }

  loginUser(username: string, password: string): Observable<boolean> {
    return this.http.post<any>(this.loginUrl, { username, password })
      .pipe(
        map(response => {
          // Guarda los datos del usuario y el token en localStorage si el login es exitoso
          if (response.token) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            return true;
          }
          return false;
        }),
        catchError(error => {
          console.error('Error de autenticación:', error);
          return of(false); // Devuelve un Observable que emite false en caso de error de autenticación
        })
      );
  }

  getCurrentUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('token');
  }
}

