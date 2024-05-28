import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocietyService {

  // private apiUrl = 'http://example.com/api/societies'; // Ajusta esta URL según tu API

  // constructor(private http: HttpClient) {}

  // getSocietyByCode(codigo: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/${codigo}`);
  // }
}
