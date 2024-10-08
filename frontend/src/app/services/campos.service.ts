import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { AppConfig } from '../../config/app-config';

@Injectable({
  providedIn: 'root'
})
export class CamposService {

  private apiUrl = AppConfig.API_URL;
  private readonly CAMPOS_KEY = 'campos';

  constructor(private http : HttpClient) { }

  getCamposPorTipoProducto(id_tipo_producto: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/campos?id_tipo_producto=${id_tipo_producto}`);
  }

  getCamposVisiblesPorTipoProducto(id_tipo_producto: string): Observable<any> {
    return this.getCamposPorTipoProducto(id_tipo_producto)
    .pipe(
      map((campos :any) => campos.filter((campo :any) => campo.visible === '1'))
    );
  }

  getCamposFormularioPorTipoProducto(id_tipo_producto: string): Observable<any> {
    return this.getCamposPorTipoProducto(id_tipo_producto)
    .pipe(
      map((campos :any) => campos.filter((campo :any) => campo.aparece_formulario === '1'))
    );
  }

  editCamposPorTipoProducto(tipo_producto_id: any, campos: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/campos-update/${tipo_producto_id}`, {campos});
  }

  getOpcionesPorCampo(campo_id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/opciones/${campo_id}`);
  }

  crearCampoConOpciones(campo: any, id_tipo_producto: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-campo-opciones/${id_tipo_producto}`, campo);
  }

  actualizarCampoConOpciones(campo: any, id_campo: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-campo-opciones/${id_campo}`, campo);
  }

}
