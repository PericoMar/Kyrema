import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USER_KEY = 'currentUser';
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient){}


  getComercialById(id_sociedad: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/comercial/${id_sociedad}`);
  }

  getComercialesPorSociedad(id_sociedad : any){
    return this.http.get<any>(`${this.apiUrl}/comerciales/sociedad/${id_sociedad}`);
  }

  getCurrentUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  deleteComercial(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/comercial/${id}`);
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('token');
  }

  createCommercial(commercial: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/comercial`, commercial);
  }

  updateCommercial(commercial_id: any, commercial: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/comercial/${commercial_id}`, commercial);
  }
}

