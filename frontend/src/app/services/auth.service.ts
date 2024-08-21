import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppConfig } from '../../config/app-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'currentUser';
  private readonly TOKEN_KEY = 'token';
  private loginUrl = AppConfig.API_URL; // Actualiza esta URL con la ruta de tu backend
  private isLoged : boolean = false;

  constructor(private http: HttpClient) {}

  loginUser(usuario: string, contraseña: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.loginUrl}/api/auth/login`, { usuario, contraseña }, { headers })
      .pipe(
        map(response => {
          console.log(response);
          // Guarda los datos del usuario y el token en localStorage si el login es exitoso
          if (response.token) {
            this.isLoged = true;
        
            // Extraer los datos específicos del objeto response.comercial
            const { id, nivel, id_sociedad, nombre, usuario } = response.comercial;
        
            // Crear el objeto comercial con los datos extraídos
            const comercial = {
                id,
                nivel,
                id_sociedad,
                nombre,
                usuario
            };
        
            // Guardar el objeto comercial y el token en localStorage
            localStorage.setItem(this.USER_KEY, JSON.stringify(comercial));
            localStorage.setItem(this.TOKEN_KEY, response.token);
        
            return comercial;
        }
          return false;
        }),
        catchError(error => {
          console.error('Error de autenticación:', error);
          return of(false); // Devuelve un Observable que emite false en caso de error de autenticación
        })
      );
  }

  getLoggedStatus(){
    return this.isLoged;
  }
}
