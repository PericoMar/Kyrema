import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamilyProductService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http : HttpClient) { }

  getTipoProductoPorId(id_tipo_producto: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/tipo-producto/show/${id_tipo_producto}`);
  }

  getTipoProductoPorLetras(letras_identificacion: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/tipo-producto/${letras_identificacion}`);
  }
}
