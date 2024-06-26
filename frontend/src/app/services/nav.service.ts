import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  private navUrl = 'http://localhost:8000/api/nav';

  constructor(private http: HttpClient) { }

  getNavegation(nivel: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<any>(`${this.navUrl}?nivel=${nivel}`, { headers });
  }
}
