import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FamilyProductService {
  private apiUrl = 'http://localhost:8000/api/';

  constructor(private http : HttpClient) { }

  getTiposProductoPorSociedad(id_sociedad: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}tipos-producto/sociedad/${id_sociedad}`);
  }

  getTipoProductoPorId(id_tipo_producto: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}tipo-producto/show/${id_tipo_producto}`);
  }

  getTipoProductoPorLetras(letras_identificacion: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}tipo-producto/${letras_identificacion}`);
  }

  getAllTipos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}tipos-producto/all`);
  }

  deleteTipoProducto(id_tipo_producto: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}tipo-producto/delete/${id_tipo_producto}`);
  }
  
}
