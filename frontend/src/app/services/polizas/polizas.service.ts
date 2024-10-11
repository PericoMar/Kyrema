import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../config/app-config';

@Injectable({
  providedIn: 'root'
})
export class PolizasService {

  private apiUrl = AppConfig.API_URL;


  constructor(private http : HttpClient) { }

  getPolizasByCompany(companyId: number){
    return this.http.get(`${this.apiUrl}/company/${companyId}/polizas`);
  }

  getPolizaById(id: number){
    return this.http.get(`${this.apiUrl}/poliza/${id}`);
  }

  createPoliza(data: any){
    return this.http.post(`${this.apiUrl}/poliza`, data);
  }

  updatePoliza(id: number, data: any){
    return this.http.put(`${this.apiUrl}/poliza/${id}`, data);
  }
}
