import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable,of, tap } from 'rxjs';
import { Society } from '../interfaces/society';
import { AppConfig } from '../../config/app-config';

@Injectable({
  providedIn: 'root'
})
export class SocietyService {
  private readonly SOCIETY_KEY = "currentSociety";
  private readonly SOCIEDADES_HIJAS_KEY = 'sociedades';
  private apiUrl = AppConfig.API_URL;
  private sociedad!: any;
  private sociedadesHijas!: any[];
  private sociedadActual!: Society;
  private sociedadSource = new BehaviorSubject<any>(null);
  sociedad$ = this.sociedadSource.asObservable();

  // Método para actualizar la sociedad
  actualizarSociedad(sociedad: any) {
    this.sociedadSource.next(sociedad);
  }

  constructor(private http: HttpClient,private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe(params => {
      this.sociedad = params.get('sociedad') || '';
    });
  }

  
  getSociedadIdPorUrl(){
    return this.sociedad;
  }

  getSocietyById(id_sociedad: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sociedad/${id_sociedad}`);
  }


  getSociedadAndHijas(id_sociedad: string | undefined): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sociedad/hijas/${id_sociedad}`);
  }

  guardarSociedadesEnLocalStorage(sociedades: any[]): void {
    if(typeof window !== 'undefined' && localStorage){
      localStorage.setItem(this.SOCIEDADES_HIJAS_KEY, JSON.stringify(sociedades));
    } else {
      this.sociedadesHijas = sociedades;
    }
      
  }

  getSociedadesHijas(){
    const sociedades = localStorage.getItem(this.SOCIEDADES_HIJAS_KEY);
    return sociedades ? JSON.parse(sociedades) : this.sociedadesHijas;
  }

  getSociedadesHijasObservable() : Observable<any>{
    const sociedades = localStorage.getItem(this.SOCIEDADES_HIJAS_KEY);
    if (typeof window !== 'undefined' && localStorage && sociedades) {
      return of(JSON.parse(sociedades));
    } else {
      return of(this.sociedadesHijas);
    }
  }

  getSociedadesHijasPorTipoProducto(letras_identificacion : string, sociedad_id :string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sociedad/${sociedad_id}/hijas/tipo-producto/${letras_identificacion}`);
  }

  setSociedadLocalStorage(sociedad : any){
    localStorage.setItem(this.SOCIETY_KEY, JSON.stringify(sociedad));
    this.sociedadActual = sociedad;
  }

  getCurrentSociety() {
    const sociedad = localStorage.getItem(this.SOCIETY_KEY);
    return sociedad ? JSON.parse(sociedad) : this.sociedadActual;
  }

  connectSocietyWithTipoProducto(sociedad_id: string, tipo_producto_id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tipo-producto-sociedad`, {id_sociedad: sociedad_id, id_tipo_producto: tipo_producto_id});
  }  

  createSociety(sociedad: any, logo: File): Observable<any> {
    const formData: FormData = new FormData();
  
    // Agregar los datos de la sociedad
    for (const key in sociedad) {
      formData.append(key, sociedad[key]);
    }
  
    // Agregar el archivo de logo
    if (logo) {
      formData.append('logo', logo);
    }
  
    return this.http.post<any>(`${this.apiUrl}/sociedad`, formData);
  }
  
  updateSociety(id: any, sociedad: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/sociedad/${id}`, sociedad);
  }

  connectTipoProductoFromSocietyToAnother(sociedad_padre_id : string, sociedad_hija_id : string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sociedad/${sociedad_padre_id}/hija/${sociedad_hija_id}`, {});
  }

  deleteSociety(sociedad_id : any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/sociedad/${sociedad_id}`);
  }

  updateSocietyPermissions(sociedad_id: string, permisosTiposProductos: any[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/sociedad/${sociedad_id}/permisos`, { permisosTiposProductos });
  }

  getSociedadesPadres(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sociedades/padres`);
  }

  connectPaymentTypesFromSocietyToAnother(sociedad_padre_id: string, sociedad_hija_id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/sociedad/${sociedad_padre_id}/hija/${sociedad_hija_id}/tipos-pago`, {});
  }

  getSociedadPorComercial(comercial_id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/sociedad/comercial/${comercial_id}`);
  }
}
