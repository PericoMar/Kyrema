import { Component } from '@angular/core';
import { FamilyProductService } from '../../services/family-product.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProductDialogComponent } from '../../components/delete-product-dialog/delete-product-dialog.component';
import { ManagementTableComponent } from '../../components/management-table/management-table.component';

@Component({
  selector: 'app-products-manager',
  standalone: true,
  imports: [ManagementTableComponent],
  templateUrl: './products-manager.component.html',
  styleUrl: './products-manager.component.css'
})
export class ProductsManagerComponent {
  insurances!: any[];
  displayedColumns: string[] = ['nombre', 'actions'];
  dataType :string = 'producto';
  configUrl : string = '/configurador-productos';

  constructor(
    private familyService: FamilyProductService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.familyService.getAllTipos().subscribe({
      next: (tipos: any[]) => {
        this.insurances = tipos.map(tipo => ({ id: tipo.id, nombre: tipo.nombre }));
        console.log('Insurances: ', this.insurances);
      },
      error: (error: any) => {
        console.error('Error loading insurances', error);
      }
    });
  }


  openDeleteDialog(data: any): void {
    this.dialog.open(DeleteProductDialogComponent, {
      width: '400px',
      data: {
        id: data.id,
        message: '¿Estás seguro que deseas eliminar el siguiente tipo de producto?',
        nombre: data.type
      },
    });
  }
}
