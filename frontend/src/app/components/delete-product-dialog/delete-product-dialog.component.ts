import { Component, Inject } from '@angular/core';
import { ButtonSpinnerComponent } from '../button-spinner/button-spinner.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FamilyProductService } from '../../services/family-product.service';

@Component({
  selector: 'app-delete-product-dialog',
  standalone: true,
  imports: [MatDialogModule, ButtonSpinnerComponent],
  templateUrl: './delete-product-dialog.component.html',
  styleUrl: './delete-product-dialog.component.css'
})
export class DeleteProductDialogComponent {
  constructor(
    private familyService: FamilyProductService,
    public dialogRef: MatDialogRef<DeleteProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id:string, message: string, nombre: string}
  ) {}

  loading :boolean = false;

  onClose(): void {
    this.dialogRef.close();
  }

  confirmDelete(data: any): void {
    this.loading = true;
    this.familyService.deleteTipoProducto(data.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
        // Recargar la pagina:
        window.location.reload();
      },
      error: (error: any) => {
        console.error('Error deleting the product', error);
      }
    });
  }
}
