import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http : HttpClient) { }

  getProductosByTipoAndSociedades(letras_identificacion: string, sociedades: any[]): Observable<any> {
    const params = new HttpParams().set('sociedades', sociedades.join(','));
    return this.http.get<any>(`${this.apiUrl}/productos/${letras_identificacion}`, { params });
  }

  getProductosByTipoAndSociedadesNoAnulados(letras_identificacion: string, sociedades: any[]): Observable<any> {
    return this.getProductosByTipoAndSociedades(letras_identificacion, sociedades).pipe(
      map((productos: any[]) => productos.filter(producto => producto.anulado == 0)));
  }

  getProductosByTipoAndSociedadesAnulados(letras_identificacion: string, sociedades: any[]): Observable<any> {
    return this.getProductosByTipoAndSociedades(letras_identificacion, sociedades).pipe(
      map((productos: any[]) => productos.filter(producto => producto.anulado == 1)));
  }

  //Esto crea la tabla en BDD de los productos nuevos
  crearTipoProducto(nuevoTipoProducto : any): Observable<any>{
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post<any>(`${this.apiUrl}/crear-tipo-producto`, nuevoTipoProducto,  { headers });
  }

  subirPlantilla(letrasIdentificacion: any, plantilla: File): Observable<any>{
    const formData : FormData = new FormData();
    formData.append('plantilla', plantilla);

    return this.http.post<any>(`${this.apiUrl}/subir-plantilla/${letrasIdentificacion}`, formData, {
      responseType: 'json'
    });
  }

  downloadPlantilla(letrasIdentificacion: string, id: any): Observable<Blob> {
    const url = `${this.apiUrl}/descargar-plantilla/${letrasIdentificacion}`;
  
    // Configurar parámetros de la consulta en la URL
    let params = new HttpParams().set('id', id);

    // Configurar cabeceras si es necesario
    const headers = new HttpHeaders({
      'Accept': 'application/pdf' // Asegúrate de aceptar el tipo de contenido PDF
    });

    // Realizar la solicitud HTTP con responseType 'blob' para descargar un archivo
    return this.http.get(url, {
      params: params,
      headers: headers,
      responseType: 'blob' // Asegura que la respuesta se trate como un Blob
    });
  }

  //Esto inserta una fila en la tabla del producto
  //En el objeto nuevoProducto NO se debe incluir el id del tipo de producto
  crearProducto(tipo_producto: any, nuevoProducto : any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/crear-producto/${tipo_producto}`, {nuevoProducto});
  }

  //Esto edita una fila en la tabla del producto
  //En el objeto nuevoProducto se debe incluir el id del tipo de producto
  editarProducto(tipo_producto: any, productoEditado : any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/editar-producto/${tipo_producto}`, {productoEditado});
  }

  //Esto elimina una fila en la tabla del producto
  deleteProduct(tipo_producto: any, id: any): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/eliminar-producto/${tipo_producto}?id=${id}`);
  }

  anularProducto(tipo_producto: any, desc_anulacion : any ): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/anular-producto/${tipo_producto}`, desc_anulacion);
  }
}
