import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  //Esto crea la tabla en BDD de los productos nuevos
  crearTipoProducto(nuevoTipoProducto : any): Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<any>(`${this.apiUrl}/api/crear-tipo-producto`, nuevoTipoProducto,  { headers });
  }

  subirPlantilla(letrasIdentificacion: any, plantilla: File): Observable<any>{
    const formData : FormData = new FormData();
    formData.append('plantilla', plantilla);

    return this.http.post<any>(`${this.apiUrl}/api/subir-plantilla/${letrasIdentificacion}`, formData, {
      responseType: 'json'
    });
  }

  //Esto inserta una fila en la tabla del producto
  //En el objeto nuevoProducto NO se debe incluir el id del tipo de producto
  crearProducto(tipo_producto: any, nuevoProducto : any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/api/crear-producto/${tipo_producto}`, {nuevoProducto});
  }

  //Esto edita una fila en la tabla del producto
  //En el objeto nuevoProducto se debe incluir el id del tipo de producto
  editarProducto(tipo_producto: any, productoEditado : any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/api/editar-producto${tipo_producto}`, {productoEditado});
  }
}
