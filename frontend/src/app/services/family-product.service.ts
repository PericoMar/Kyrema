import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../config/app-config';

@Injectable({
  providedIn: 'root'
})
export class FamilyProductService {
  private apiUrl = AppConfig.API_URL;

  constructor(private http : HttpClient) { }

  getTiposProductoPorSociedad(id_sociedad: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tipos-producto/sociedad/${id_sociedad}`);
  }

  getTipoProductoPorId(id_tipo_producto: string | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tipo-producto/show/${id_tipo_producto}`);
  }

  getTipoProductoPorLetras(letras_identificacion: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tipo-producto/${letras_identificacion}`);
  }

  getAllTipos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/tipos-producto/all`);
  }

  deleteTipoProducto(id_tipo_producto: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/tipo-producto/delete/${id_tipo_producto}`);
  }
  
  editTipoProducto(id_tipo_producto: string | null, nombre: any, casilla_logo_sociedad : any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/tipo-producto/edit/${id_tipo_producto}`, {nombre, casilla_logo_sociedad});
  }

  getSubproductosByPadreId(id_padre: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/subproductos/padre/${id_padre}`);
  }

}
