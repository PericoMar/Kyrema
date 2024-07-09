import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  private navUrl = 'http://localhost:8000/api/nav';

  constructor(private http: HttpClient) { }

  getNavegation(nivel: string): Observable<any> {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    // return this.http.get<any>(`${this.navUrl}?nivel=${nivel}`, { headers });
    return of([
      {
          "label": "Administración",
          "children": []
      },
      {
          "label": "Gestión",
          "children": [
              {
                  "label": "Sociedades",
                  "link": "/sociedades"
              },
              {
                  "label": "Tarifas",
                  "link": "/tarifas"
              },
              {
                  "label": "Comisiones",
                  "link": "/comisiones"
              },
              {
                  "label": "Productos",
                  "link": "/gestion-productos"
              }
          ]
      },
      {
          "label": "Productos",
          "children": [
              {
                  "label": "Seguros Combinados",
                  "children": [
                    {
                      "label" : "Seguro K1",
                      "link": "/operaciones/seguro-k1",
                    },
                    {
                      "label" : "Seguro K2",
                      "link": "/operaciones/seguro-k2",
                    },
                    {
                      "label" : "Seguro K3",
                      "link": "/operaciones/seguro-k3",
                    },
                    {
                      "label" : "Seguro KR",
                      "link": "/operaciones/seguro-kr",
                    },
                    {
                      "label": "Seguro KP",
                      "link": "/operaciones/seguro-kp"
                    },
                    {
                      "label": "Seguro KVIP",
                      "link": "/operaciones/seguro-kvip"
                    },
                    {
                      "label": "Seguro TMC",
                      "link": "/operaciones/seguro-tmc"
                    },
                    {
                      "label": "Seguro TMCA",
                      "link": "/operaciones/seguro-tmca"
                    },
                    {
                      "label": "Seguro TMG",
                      "link": "/operaciones/seguro-tmg"
                    },
                    {
                      "label": "Seguro TMM",
                      "link": "/operaciones/seguro-tmm"
                    },
                    {
                      "label": "Seguro TMCE",
                      "link": "/operaciones/seguro-tmce"
                    },
                    {
                      "label": "Seguro K1C",
                      "link": "/operaciones/seguro-k1c"
                    },
                    {
                      "label": "Seguro K2C",
                      "link": "/operaciones/seguro-k2c"
                    },
                    {
                      "label": "Seguro K3C",
                      "link": "/operaciones/seguro-k3c"
                    },
                    {
                      "label": "Seguro KVIPC",
                      "link": "/operaciones/seguro-kvipc"
                    },
                    {
                      "label": "Seguro KRC",
                      "link": "/operaciones/seguro-krc"
                    },
                    {
                      "label": "Seguro KPC",
                      "link": "/operaciones/seguro-kpc"
                    },
                    {
                      "label": "Seguro K1-TE",
                      "link": "/operaciones/seguro-k1-te"
                    },
                    {
                      "label": "Seguro K2-TE",
                      "link": "/operaciones/seguro-k2-te"
                    },
                    {
                      "label": "Seguro K3-TE",
                      "link": "/operaciones/seguro-k3-te"
                    },
                    {
                      "label": "Seguro KR-TE",
                      "link": "/operaciones/seguro-kr-te"
                    },
                    {
                      "label": "Seguro KVIP-TE",
                      "link": "/operaciones/seguro-kvip-te"
                    },
                    {
                      "label": "Seguro KRA",
                      "link": "/operaciones/seguro-kra"
                    },
                    {
                      "label": "Seguro K2A",
                      "link": "/operaciones/seguro-k2a"
                    },
                    {
                      "label": "Seguro K3A",
                      "link": "/operaciones/seguro-k3a"
                    },
                    {
                      "label": "Seguro KF",
                      "link": "/operaciones/seguro-kf"
                    },
                    {
                      "label": "Seguro AK1",
                      "link": "/operaciones/seguro-ak1"
                    },
                    {
                      "label": "Seguro AK2",
                      "link": "/operaciones/seguro-ak2"
                    },
                    {
                      "label": "Seguro AK3",
                      "link": "/operaciones/seguro-ak3"
                    },
                    {
                      "label": "Seguro AKP",
                      "link": "/operaciones/seguro-akp"
                    },
                    {
                      "label": "Seguro AKVIP",
                      "link": "/operaciones/seguro-akvip"
                    },
                    {
                      "label": "Seguro AKR",
                      "link": "/operaciones/seguro-akr"
                    },
                    {
                      "label": "Seguro K-AEPES",
                      "link": "/operaciones/seguro-k-aepes"
                    },
                    {
                      "label": "Seguro KA3",
                      "link": "/operaciones/seguro-ka3"
                    },
                    {
                      "label": "Seguro KAVIP",
                      "link": "/operaciones/seguro-kavip"
                    },
                    {
                      "label": "Seguro KT",
                      "link": "/operaciones/seguro-kt"
                    },
                    {
                      "label": "Seguro KL",
                      "link": "/operaciones/seguro-kl"
                    },
                    {
                      "label": "Seguro KVIPP",
                      "link": "/operaciones/seguro-kvipp"
                    }
                  ]
              },
              {
                  "label": "Seguros de Cacerías",
                  "link": "/operaciones/seguros-cacerias"
              },
              {
                  "label": "Tarjetas Emisoras",
                  "link": "/operaciones/tarjetas-emisoras"
              },
              {
                  "label": "Seguros Kyrema Naturaleza",
                  "link": "/operaciones/seguros-kyrema-naturaleza"
              },
              {
                  "label": "Seguros Extranjeros",
                  "link": "/operaciones/seguros-extranjeros"
              }
          ]
      }
  ])
  }
}
