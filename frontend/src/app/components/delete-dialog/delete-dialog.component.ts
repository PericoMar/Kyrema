import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProductsService } from '../../services/products.service';
import { MatButtonModule } from '@angular/material/button';
import { ProductNotificationService } from '../../services/product-notification.service';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css'
})
export class DeleteDialogComponent {
  constructor(
    private productNotificationService: ProductNotificationService,
    private productService: ProductsService,
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id:string, message: string, codigo_producto: string, tipo_producto: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  confirmDelete(data: any): void {
    this.productService.deleteProduct(data.tipo_producto, data.id).subscribe({
      next: () => {
        this.productNotificationService.notifyChangesOnProducts();
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        console.error('Error deleting the product', error);
      }
    });
  }
}
