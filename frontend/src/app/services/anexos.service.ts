import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnexosService {

  private apiUrl = 'http://localhost:8000/api';


  constructor(private http : HttpClient) { }

  getAnexosPorSociedad(id_sociedad: string){
    return this.http.get<any>(`${this.apiUrl}/anexos/sociedad/${id_sociedad}`);
  }

  deleteAnexo(id_anexo: string){
    return this.http.delete<any>(`${this.apiUrl}/anexos/${id_anexo}`);
  }
}
