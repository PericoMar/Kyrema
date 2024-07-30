import { Component } from '@angular/core';
import { FamilyProductService } from '../../services/family-product.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SocietyService } from '../../services/society.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-permissions-by-society',
  standalone: true,
  imports: [MatCheckboxModule, FormsModule, CommonModule],
  templateUrl: './permissions-by-society.component.html',
  styleUrl: './permissions-by-society.component.css'
})
export class PermissionsBySocietyComponent {
  tiposProductos! : any[];
  sociedades: any;
  currentSociedadId: any;

  constructor(
    private familyService: FamilyProductService,
    private societyService: SocietyService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      this.currentSociedadId = params.get('sociedad') || '';
      this.sociedades = this.societyService.getSociedadesHijas();
      this.familyService.getTiposProductoPorSociedad(this.currentSociedadId).subscribe((response) => {
        this.tiposProductos = response
        console.log(this.tiposProductos);
        console.log(this.sociedades);
        this.loadSociedadPorTipoProductoArray();
        console.log(this.sociedades);
      });
    });
    
  }

  loadSociedadPorTipoProductoArray(){
    let tiposProductosPorSociedad : any[] = [];
    this.sociedades = this.sociedades.map((society : any) => {
      this.familyService.getTiposProductoPorSociedad(society.id).subscribe(
        (response) => {
          tiposProductosPorSociedad = response;
        }
      );
      return {
        id: society.id,
        nombre: society.nombre,
        tiposProductosPorSociedad : tiposProductosPorSociedad
      }
    });
  }
}
