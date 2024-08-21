import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../config/app-config';

@Injectable({
  providedIn: 'root'
})
export class AnexosService {

  private apiUrl = AppConfig.API_URL;


  constructor(private http : HttpClient) { }

  getAnexosPorSociedad(id_sociedad: string){
    return this.http.get<any>(`${this.apiUrl}/anexos/sociedad/${id_sociedad}`);
  }

  deleteAnexo(id_anexo: string){
    return this.http.delete<any>(`${this.apiUrl}/anexos/${id_anexo}`);
  }

  createTipoAnexo(nuevoTipoAnexo: any){
    return this.http.post<any>(`${this.apiUrl}/anexos`, nuevoTipoAnexo);
  }

  getTipoAnexosPorTipoProducto(id_tipo_producto: string){
    return this.http.get<any>(`${this.apiUrl}/anexos/tipo-producto/${id_tipo_producto}`);
  }

  getAnexosPorProducto(id_tipo_producto: string, id_producto: string){
    return this.http.get<any>(`${this.apiUrl}/anexos/${id_tipo_producto}/producto/${id_producto}`);
  }

  getCamposPorTipoAnexo(id_tipo_anexo: string){
    return this.http.get<any>(`${this.apiUrl}/campos-anexo/tipo-anexo/${id_tipo_anexo}`);
  }

  conectarAnexosConProductos(anexos: any, id_producto: any){
    return this.http.post<any>(`${this.apiUrl}/anexos/${id_producto}`, {anexos})
  }

  getAllTiposAnexos(){
    return this.http.get<any>(`${this.apiUrl}/tipos-anexo/all`);
  }
}
