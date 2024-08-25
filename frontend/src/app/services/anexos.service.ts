import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../config/app-config';
import { Observable } from 'rxjs';

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
    console.log(nuevoTipoAnexo);
    return this.http.post<any>(`${this.apiUrl}/anexos`, nuevoTipoAnexo);
  }

  subirPlantillaAnexo(letrasIdentificacion: any, plantilla: File): Observable<any>{
    const formData : FormData = new FormData();
    formData.append('plantilla', plantilla);

    return this.http.post<any>(`${this.apiUrl}/subir-plantilla-anexo/${letrasIdentificacion}`, formData, {
      responseType: 'json'
    });
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

  downloadAnexo(tipoAnexoId: any, id:any): Observable<Blob> {
    const url = `${this.apiUrl}/descargar-plantilla-anexo/${tipoAnexoId}`;
  
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
}
