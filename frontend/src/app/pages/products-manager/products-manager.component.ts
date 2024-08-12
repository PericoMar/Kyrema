import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FamilyProductService } from '../../services/family-product.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { ErrorDialogComponent } from '../../components/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProductDialogComponent } from '../../components/delete-product-dialog/delete-product-dialog.component';

@Component({
  selector: 'app-products-manager',
  standalone: true,
  imports: [ReactiveFormsModule, MatTableModule, MatButtonModule, RouterModule, SpinnerComponent, ErrorDialogComponent],
  templateUrl: './products-manager.component.html',
  styleUrl: './products-manager.component.css'
})
export class ProductsManagerComponent {
  insurances: any[] = [];
  displayedColumns: string[] = ['type', 'actions'];
  insuranceForm: FormGroup;

  constructor(
    private familyService: FamilyProductService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.insuranceForm = this.fb.group({
      // Define any form controls if needed
    });
  }

  ngOnInit(): void {
    this.familyService.getAllTipos().subscribe({
      next: (tipos: any[]) => {
        this.insurances = tipos.map(tipo => ({ id: tipo.id, type: tipo.nombre }));
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
