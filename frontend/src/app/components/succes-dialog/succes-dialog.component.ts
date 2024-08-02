import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-succes-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './succes-dialog.component.html',
  styleUrl: './succes-dialog.component.css'
})
export class SuccesDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SuccesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
