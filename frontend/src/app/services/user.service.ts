import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { AppConfig } from '../../config/app-config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USER_KEY = 'currentUser';
  private apiUrl = AppConfig.API_URL;

  constructor(private http: HttpClient){}


  getAllUsers(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/comerciales/all`);
  }

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
    //Quitar todo los datos del local storage
    localStorage.clear();
  }

  createCommercial(commercial: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/comercial`, commercial);
  }

  updateCommercial(commercial_id: any, commercial: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/comercial/${commercial_id}`, commercial);
  }
}

