import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable,of, tap } from 'rxjs';
import { Society } from '../interfaces/society';

@Injectable({
  providedIn: 'root'
})
export class SocietyService {
  private readonly SOCIETY_KEY = "currentSociety";
  private readonly SOCIEDADES_HIJAS_KEY = 'sociedades';
  private apiUrl = 'http://localhost:8000/api';
  private sociedad!: string;

  constructor(private http: HttpClient,private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe(params => {
      this.sociedad = params.get('sociedad') || '';
    });
  }

  
  getSociedadIdPorUrl(){
    return this.sociedad;
  }

  getSocietyById(id_sociedad: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sociedad/${id_sociedad}`).pipe(
      tap(response => {
        if (response.logo) {
          response.logo = `data:image/png;base64,${response.logo}`;
        }
      })
    );
  }


  getSociedadAndHijas(id_sociedad: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sociedad/hijas/${id_sociedad}`);
  }

  guardarSociedadesEnLocalStorage(sociedades: any[]): void {
    localStorage.setItem(this.SOCIEDADES_HIJAS_KEY, JSON.stringify(sociedades));
  }

  getSociedadesHijas(){
    const sociedades = localStorage.getItem(this.SOCIEDADES_HIJAS_KEY);
    return sociedades ? JSON.parse(sociedades) : null;
  }

  getSociedadesHijasObservable() : Observable<any>{
    const sociedades = localStorage.getItem(this.SOCIEDADES_HIJAS_KEY);
    return of(sociedades ? JSON.parse(sociedades) : null);
  }

  setSociedadLocalStorage(sociedad : any){
    localStorage.setItem(this.SOCIETY_KEY, JSON.stringify(sociedad));
  }

  getCurrentSociety() {
    const sociedad = localStorage.getItem(this.SOCIETY_KEY);
    return sociedad ? JSON.parse(sociedad) : null;
  }

  connectSocietyWithTipoProducto(sociedad_id: string, tipo_producto_id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tipo-producto-sociedad`, {id_sociedad: sociedad_id, id_tipo_producto: tipo_producto_id});
  }  

  createSociety(sociedad: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sociedad`, sociedad);
  }

  updateSociety(id: any, sociedad: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/sociedad/${id}`, sociedad);
  }

  connectTipoProductoFromSocietyToAnother(sociedad_padre_id : string, sociedad_hija_id : string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sociedad/${sociedad_padre_id}/hija/${sociedad_hija_id}`, {});
  }
}
