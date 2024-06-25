import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  private loginUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getNavegation(id_sociedad:string){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.loginUrl}/api/nav`, { id_sociedad }, { headers })
  }
}
