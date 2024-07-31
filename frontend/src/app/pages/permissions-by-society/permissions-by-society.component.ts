import { Component } from '@angular/core';
import { FamilyProductService } from '../../services/family-product.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SocietyService } from '../../services/society.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { MatButtonModule } from '@angular/material/button';
import { ErrorDialogComponent } from '../../components/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-permissions-by-society',
  standalone: true,
  imports: [MatCheckboxModule, FormsModule, CommonModule, SpinnerComponent, MatButtonModule],
  templateUrl: './permissions-by-society.component.html',
  styleUrl: './permissions-by-society.component.css'
})
export class PermissionsBySocietyComponent {
  todosLosTiposProductos! : any[];
  tiposProductos: { id: string, nombre: string, tienePermisos: boolean }[] = [];
  sociedadId!: string;
  sociedadNombre: any;

  constructor(
    private familyService: FamilyProductService,
    private societyService: SocietyService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.sociedadId = params.get('sociedad') || '';
      this.societyService.getSocietyById(this.sociedadId).subscribe((response) => {
        this.sociedadNombre = response.nombre;
      });
      this.loadTiposProductos();
    });
  }

  loadTiposProductos() {
    this.familyService.getTiposProductoPorSociedad(this.societyService.getCurrentSociety().id)
      .subscribe((response) => {
        this.todosLosTiposProductos = response;
        const tiposProductosDisponibles = response;
        console.log(tiposProductosDisponibles);
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
            id: tipoProducto.id,
            nombre: tipoProducto.nombre,
            tienePermisos
          };
        });
        console.log(this.tiposProductos);
      });
  }

  onSubmit() {
    if(!this.tienePermisosAlmenosUnTipoProducto()) {
      this.showErrorDialog('Debe tener permisos para al menos un tipo de producto.');
    } else {
      this.societyService.updateSocietyPermissions(this.sociedadId, this.tiposProductos).subscribe((response) => {
        console.log(response);
        this.router.navigate(['/sociedades']);
      });
    }
  }

  offActiveAll(){
    this.tiposProductos.forEach((tipoProducto) => tipoProducto.tienePermisos = false);
  }

  tienePermisosAlmenosUnTipoProducto() {
    return this.tiposProductos.some((tp) => tp.tienePermisos);
  }

  showErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      width: '300px',
      data: { message }
    });
  }
}
