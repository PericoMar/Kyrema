import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable,of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocietyService {
  private readonly SOCIETY_KEY = "currentSociety";
  private apiUrl = 'http://localhost:8000';
  private sociedad!: string;

  constructor(private http: HttpClient,private route: ActivatedRoute, private router: Router) {
    this.route.paramMap.subscribe(params => {
      this.sociedad = params.get('sociedad') || '';
    });
  }

  getSocietyById(id_sociedad: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/sociedad/${id_sociedad}`).pipe(
      tap(response => {
        if (response.logo) {
          response.logo = `data:image/png;base64,${response.logo}`;
        }
      })
    );
  }

  getSociedadAndHijas(id_sociedad: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/sociedad/hijas/${id_sociedad}`);
  }

  guardarSociedadesEnLocalStorage(sociedades: any[]): void {
    localStorage.setItem('sociedades', JSON.stringify(sociedades));
  }

  setSociedadLocalStorage(sociedad : any){
    localStorage.setItem(this.SOCIETY_KEY, JSON.stringify(sociedad));
  }

  getCurrentSociety() {
    const sociedad = localStorage.getItem(this.SOCIETY_KEY);
    return sociedad ? JSON.parse(sociedad) : null;
  }

  getSociedadPorRuta(): string {
    return this.sociedad;
  }
}
