import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { AppConfig } from '../../config/app-config';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = AppConfig.API_URL;

  constructor(private http : HttpClient) { }

  getProductosByTipoAndSociedades(letras_identificacion: string, sociedades: any[]): Observable<any> {
    const params = new HttpParams().set('sociedades', sociedades.join(','));
    return this.http.get<any>(`${this.apiUrl}/productos/${letras_identificacion}`, { params });
  }

  getProductosByTipoAndSociedadesNoAnulados(letras_identificacion: string, sociedades: any[]): Observable<any> {
    return this.getProductosByTipoAndSociedades(letras_identificacion, sociedades).pipe(
      tap(() => console.time('Filtrado de productos')), // Iniciar temporizador
      map((productos: any[]) => productos.filter(producto => producto.anulado == 0)),
      tap(() => console.timeEnd('Filtrado de productos')) // Finalizar temporizador y mostrar tiempo en consola
    );
}


  getProductosByTipoAndSociedadesAnulados(letras_identificacion: string, sociedades: any[]): Observable<any> {
    return this.getProductosByTipoAndSociedades(letras_identificacion, sociedades).pipe(
      map((productos: any[]) => productos.filter(producto => producto.anulado == 1)));
  }

  getProductosByTipoAndComercialNoAnulados(letras_identificacion: string, comercial_id: string | undefined): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productos/${letras_identificacion}/comercial/${comercial_id}`);
  }

  crearTipoProducto(dataTipoProducto : any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // Cambiar si es necesario
    });
  
    return this.http.post<any>(`${this.apiUrl}/crear-tipo-producto`, dataTipoProducto, { headers });
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
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejar el error aquí
        let errorMessage = 'Ocurrió un error al intentar descargar la plantilla. Vuelva a intentarlo más tarde.';
  
        // Opcional: puedes mostrar un mensaje al usuario aquí o en otro lugar
        console.error(error); // Log del error
  
        // Retornar un observable con un error
        return throwError(() => new Error(errorMessage));
      })
    );
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

  addNuevosCampos(letras_identificacion: any, campos :any): Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/add-campos/${letras_identificacion}`, {campos});
  }

  getDuraciones(nombreTabla: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/duraciones/${nombreTabla}`);
  }


  getHistorialProductosByTipoAndSociedades(letras_identificacion: string, sociedades: any[]): Observable<any> {
    const params = new HttpParams().set('sociedades', sociedades.join(','));
    return this.http.get<any>(`${this.apiUrl}/historial/${letras_identificacion}`, { params });
  }

  getHistorialProductosByTipoAndComercial(letras_identificacion: string, comercial_id: string | undefined): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/historial/${letras_identificacion}/comercial/${comercial_id}`);
  }
}
