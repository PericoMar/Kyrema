import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { ComercialNotificationService } from '../../services/comercial-notification.service';
import { ButtonSpinnerComponent } from '../button-spinner/button-spinner.component';

@Component({
  selector: 'app-delete-comercial-dialog',
  standalone: true,
  imports: [MatDialogModule, ButtonSpinnerComponent],
  templateUrl: './delete-comercial-dialog.component.html',
  styleUrl: './delete-comercial-dialog.component.css'
})
export class DeleteComercialDialogComponent {
  constructor(
    private comercialNotificationService: ComercialNotificationService,
    private comercialService: UserService,
    public dialogRef: MatDialogRef<DeleteComercialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id:string, message: string, nombre: string}
  ) {}

  loading :boolean = false;

  onClose(): void {
    this.dialogRef.close();
  }

  confirmDelete(data: any): void {
    this.loading = true;
    this.comercialService.deleteComercial(data.id).subscribe({
      next: () => {
        this.comercialNotificationService.notifyChangesOnSocieties();
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        console.error('Error deleting the product', error);
      }
    });
  }
}
