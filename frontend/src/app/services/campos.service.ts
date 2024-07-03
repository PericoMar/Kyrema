import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CamposService {

  private apiUrl = 'http://localhost:8000';

  constructor(private http : HttpClient) { }

  getCamposPorTipoProducto(id_tipo_producto: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/campos?id_tipo_producto=${id_tipo_producto}`);
  }

  getCamposVisiblesPorTipoProducto(id_tipo_producto: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/campos?id_tipo_producto=${id_tipo_producto}`)
    .pipe(
      map((campos :any) => campos.filter((campo :any) => campo.visible === '1'))
    );
  }
}
