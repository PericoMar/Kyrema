import { Component, Inject } from '@angular/core';
import { AnexosService } from '../../services/anexos.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ButtonSpinnerComponent } from '../button-spinner/button-spinner.component';

@Component({
  selector: 'app-delete-anexo-dialog',
  standalone: true,
  imports: [MatDialogModule, ButtonSpinnerComponent],
  templateUrl: './delete-anexo-dialog.component.html',
  styleUrl: './delete-anexo-dialog.component.css'
})
export class DeleteAnexoDialogComponent {
  constructor(
    private anexosService: AnexosService,
    public dialogRef: MatDialogRef<DeleteAnexoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id:string, message: string, nombre: string}
  ) {}

  loading :boolean = false;

  onClose(): void {
    this.dialogRef.close();
  }

  confirmDelete(data: any): void {
    this.loading = true;
    this.anexosService.deleteAnexo(data.id).subscribe({
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
