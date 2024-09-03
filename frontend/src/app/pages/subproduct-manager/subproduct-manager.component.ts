import { Component } from '@angular/core';
import { ManagementTableComponent } from '../../components/management-table/management-table.component';
import { MatDialog } from '@angular/material/dialog';
import { FamilyProductService } from '../../services/family-product.service';
import { DeleteProductDialogComponent } from '../../components/delete-product-dialog/delete-product-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subproduct-manager',
  standalone: true,
  imports: [ManagementTableComponent],
  templateUrl: './subproduct-manager.component.html',
  styleUrl: './subproduct-manager.component.css'
})
export class SubproductManagerComponent {
  product!: string;
  productId!: string | null;
  subproducts!: any[];
  displayedColumns: string[] = ['nombre', 'actions'];
  dataType :string = 'subproducto';
  configUrl : string = '/configurador-subproductos';

  constructor(
    private familyService: FamilyProductService,
    private dialog: MatDialog,
    private route : ActivatedRoute
  ) {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('product');
      this.configUrl = `/configurador-subproductos/${this.productId}`;
    });
  }
  ngOnInit(): void {
    this.familyService.getTipoProductoPorId(this.productId).subscribe({
      next: (tipo: any) => {
        console.log('Tipo de producto: ', tipo);
        this.product = tipo.nombre;
        this.familyService.getSubproductosByPadreId(tipo.id).subscribe({
          next: (tipos: any[]) => {
            this.subproducts = tipos.map(tipo => ({ id: tipo.id, nombre: tipo.nombre }));
            console.log('Insurances: ', this.subproducts);
          },
          error: (error: any) => {
            console.error('Error loading insurances', error);
          }
        });
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
        message: '¿Estás seguro que deseas eliminar el siguiente tipo de subproducto?',
        nombre: data.type
      },
    });
  }
}
