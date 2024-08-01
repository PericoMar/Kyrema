import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USER_KEY = 'currentUser';
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient){}


  getComercialById(id_sociedad: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/comercial/${id_sociedad}`)
    .pipe(
      map(response => {
        // Extraer los datos específicos del objeto response.comercial
        const { id, nivel, id_sociedad, nombre, usuario } = response;
    
        // Crear el objeto comercial con los datos extraídos
        const comercial = {
            id,
            nivel,
            id_sociedad,
            nombre,
            usuario
        };
    
        return response;
      }),
      catchError(error => {
        console.error('Error de autenticación:', error);
        return of(false); // Devuelve un Observable que emite false en caso de error de autenticación
      })
    );
  }

  getComercialesPorSociedad(id_sociedad : any){
    return this.http.get<any>(`${this.apiUrl}/api/comerciales/${id_sociedad}`);
  }

  getCurrentUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  deleteComercial(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/comercial/${id}`);
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('token');
  }

  createCommercial(commercial: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/comercial`, commercial);
  }

  updateCommercial(commercial_id: any, commercial: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/api/comercial/${commercial.id}`, commercial);
  }
}

