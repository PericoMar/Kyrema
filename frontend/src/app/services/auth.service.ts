import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'currentUser';
  private readonly TOKEN_KEY = 'token';
  private loginUrl = 'http://localhost:8000'; // Actualiza esta URL con la ruta de tu backend

  constructor(private http: HttpClient) {}

  loginUser(usuario: string, contraseña: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.loginUrl}/api/auth/login`, { usuario, contraseña }, { headers })
      .pipe(
        map(response => {
          // Guarda los datos del usuario y el token en localStorage si el login es exitoso
          if (response.token) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
            localStorage.setItem(this.TOKEN_KEY, response.token);
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
}
