import { Component } from '@angular/core';
import { FamilyProductService } from '../../services/family-product.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SocietyService } from '../../services/society.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-permissions-by-society',
  standalone: true,
  imports: [MatCheckboxModule, FormsModule, CommonModule, SpinnerComponent, MatButtonModule],
  templateUrl: './permissions-by-society.component.html',
  styleUrl: './permissions-by-society.component.css'
})
export class PermissionsBySocietyComponent {
  todosLosTiposProductos! : any[];
  tiposProductos!: { id: string, nombre: string, tienePermisos: boolean }[];
  sociedadId!: string;

  constructor(
    private familyService: FamilyProductService,
    private societyService: SocietyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.sociedadId = params.get('sociedad') || '';
      this.loadTiposProductos();
    });
  }

  loadTiposProductos() {
    this.familyService.getTiposProductoPorSociedad(this.societyService.getCurrentSociety().id)
      .subscribe((response) => {
        this.todosLosTiposProductos = response;
        const tiposProductosDisponibles = response;
        this.loadPermisosPorSociedad(tiposProductosDisponibles);
      });
  }

  loadPermisosPorSociedad(tiposProductosDisponibles: any[]) {
    this.familyService.getTiposProductoPorSociedad(this.sociedadId)
      .subscribe((response) => {
        const tiposProductosSociedad = response;
        this.tiposProductos = tiposProductosDisponibles.map((tipoProducto: any) => {
          const tienePermisos = tiposProductosSociedad.some((tpSociedad : any)=> tpSociedad.id === tipoProducto.id);
          return {
            ...tipoProducto,
            tienePermisos
          };
        });
      });
  }

  onSubmit() {
    console.log(this.tiposProductos);
  }
}
