import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DeleteComercialDialogComponent } from '../../../components/delete-comercial-dialog/delete-comercial-dialog.component';

@Component({
  selector: 'app-commercial-commission-button',
  standalone: true,
  imports: [RouterModule, MatIcon],
  templateUrl: './commercial-commission-button.component.html',
  styleUrl: './commercial-commission-button.component.css'
})
export class CommercialCommissionButtonComponent {
  public data: any;

  constructor(
    private dialog: MatDialog
  ) {}

  agInit(params: any): void {
    this.data = params.data;
  }


  openDeleteComercialModal(data : any){
    this.dialog.open(DeleteComercialDialogComponent, {
      width: '400px',
      data : {
        id: data.id,
        message: '¿Estás seguro que deseas eliminar el siguiente comercial?',
        nombre: data.nombre,
      },
    });
  }
}
