import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProductsService } from '../../services/products.service';
import { MatButtonModule } from '@angular/material/button';
import { ProductNotificationService } from '../../services/product-notification.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SocietyService } from '../../services/society.service';
import { UserService } from '../../services/user.service';
import { ButtonSpinnerComponent } from '../button-spinner/button-spinner.component';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatFormField, MatInput, MatLabel, FormsModule, CommonModule, ButtonSpinnerComponent],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css'
})
export class DeleteDialogComponent {
  constructor(
    private productNotificationService: ProductNotificationService,
    private productService: ProductsService,
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id:string, message: string, secondary_msg:string,  codigo_producto: string, tipo_producto: string },
    private societyService : SocietyService,
    private userService : UserService,
  ) {
    this.sociedad = this.societyService.getCurrentSociety();
    this.comercial = this.userService.getCurrentUser();
  }

  comercial!: string;
  sociedad!: any;
  sociedad_nombre!: string;

  causa: string = '';

  loading: boolean = false;

  onClose(): void {
    this.dialogRef.close();
  }

  confirmDelete(data: any): void {
    this.loading = true;

    const desc_anulacion = this.createDescAnulacion()

    this.productService.anularProducto(data.tipo_producto, desc_anulacion).subscribe({
      next: () => {
        this.productNotificationService.notifyChangesOnProducts();
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        console.error('Error deleting the product', error);
      }
    });
  }

  createDescAnulacion(){
    return {
      causa: this.causa,
      comercial: this.comercial,
      sociedad: this.sociedad_nombre,
      codigo_producto: this.data.codigo_producto,
      id: this.data.id,
      tipo_producto: this.data.tipo_producto
    }
  }
}
