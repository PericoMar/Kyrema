import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanceledService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http : HttpClient) { }

  getAnuladosByTipoAndSociedades(letras_identificacion: string, sociedades: any[]): Observable<any> {
    const params = new HttpParams().set('sociedades', sociedades.join(','));
    return this.http.get<any>(`${this.apiUrl}/anulados/${letras_identificacion}`, { params });
  }
}
