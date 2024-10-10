import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../../config/app-config';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  private apiUrl = AppConfig.API_URL;


  constructor(private http : HttpClient) { }

  getCompanies(){
    return this.http.get(`${this.apiUrl}/companies`);
  }
}
