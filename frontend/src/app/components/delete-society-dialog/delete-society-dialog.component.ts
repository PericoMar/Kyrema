import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SocietyService } from '../../services/society.service';
import { SocietyNotificationService } from '../../services/society-notification.service';

@Component({
  selector: 'app-delete-society-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './delete-society-dialog.component.html',
  styleUrl: './delete-society-dialog.component.css'
})
export class DeleteSocietyDialogComponent {
  constructor(
    private societyNotificationService: SocietyNotificationService,
    private societyService: SocietyService,
    public dialogRef: MatDialogRef<DeleteSocietyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id:string, message: string, nombre: string}
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  confirmDelete(data: any): void {
    this.societyService.deleteSociety(data.id).subscribe({
      next: () => {
        this.societyNotificationService.notifyChangesOnSocieties();
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        console.error('Error deleting the product', error);
      }
    });
  }
}
