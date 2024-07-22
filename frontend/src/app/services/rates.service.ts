import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatesService {

  private apiUrl = 'http://localhost:8000/api/';

  constructor(private http : HttpClient) { }

  getTarifasPorSociedad(id_sociedad: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}tarifas-producto/sociedad/${id_sociedad}`);
  }
}
