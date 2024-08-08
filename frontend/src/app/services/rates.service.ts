import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tarifa } from '../interfaces/tarifa';

@Injectable({
  providedIn: 'root'
})
export class RatesService {

  private apiUrl = 'http://localhost:8000/api/';

  constructor(private http : HttpClient) { }

  getTarifasPorSociedad(id_sociedad: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}tarifas/sociedad/${id_sociedad}`);
  }

  getTarifasPorSociedadAndTipoProducto(id_sociedad: string, tipo_producto_id:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}tarifas-producto/sociedad/${id_sociedad}?tipo_producto_id=${tipo_producto_id}`);
  }

  setTarifasPorSociedadAndTipoProducto(tarifaProducto : Tarifa): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}tarifa-producto/sociedad`, tarifaProducto);
  }

  updateTarifaPorSociedad(sociedad: any, tarifa: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}tarifa/sociedad/${sociedad}`, { tarifa });
  } 

  createTarifaPorSociedad(sociedad_id : any, tarifa: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}tarifa/sociedad/${sociedad_id}`, { tarifa });
  }

  //ANEXOS:
  setTarifaPorSociedadAndTipoAnexo(tarifaAnexo : any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}tarifa-anexo/sociedad`, tarifaAnexo);
  }

  getTarifaPorSociedadAndTipoAnexo(id_sociedad: string, tipo_anexo_id:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}tarifa-anexo/sociedad/${id_sociedad}/tipo-anexo/${tipo_anexo_id}`);
  } 
}
