import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  private navUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getNavegation(nivel: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(`${this.navUrl}/nav/${nivel}`, { headers });
  }

  guardarNavegacionEnLocalStorage(navegacion: any[]): void {
    localStorage.setItem('navegacion', JSON.stringify(navegacion));
  }

  getNavegacionLocalStorage(){
    const navegacion = localStorage.getItem('navegacion');
    return navegacion ? JSON.parse(navegacion) : null;
  }
}
