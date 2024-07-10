import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = 'http://localhost:8000';

  constructor(private http : HttpClient) { }

  getProductosByTipoAndSociedades(id_tipo_producto: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/productos/${id_tipo_producto}`);
  }

  crearTipoProducto(nuevoProducto : any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/api/crear-tipo-producto`, nuevoProducto);
  }

}
