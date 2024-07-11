import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = 'http://localhost:8000';

  constructor(private http : HttpClient) { }

  getProductosByTipoAndSociedades(letras_identificacion: string, sociedades: any[]): Observable<any> {
    const params = new HttpParams().set('sociedades', sociedades.join(','));
    return this.http.get<any>(`${this.apiUrl}/api/productos/${letras_identificacion}`, { params });
  }

  crearTipoProducto(nuevoProducto : any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/api/crear-tipo-producto`, nuevoProducto);
  }

}
