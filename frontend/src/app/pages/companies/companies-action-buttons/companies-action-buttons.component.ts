import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-companies-action-buttons',
  standalone: true,
  imports: [MatIcon, RouterModule],
  templateUrl: './companies-action-buttons.component.html',
  styleUrl: './companies-action-buttons.component.css'
})
export class CompaniesActionButtonsComponent {
  public data: any;


  constructor (
    // private dialog: MatDialog,
    // private snackBarService: SnackBarService,
    private router: Router,
  ) {
    
  }

  agInit(params: any): void {
    this.data = params.data;
  }

  openDeleteDialog(data : any){
    // this.dialog.open(DeleteDialogComponent, {
    //   width: '400px',
    //   data : {
    //     id: data.id,
    //     message: '¿Estás seguro que deseas anular el siguiente producto?',
    //     secondary_msg: 'Se guardará en la tabla de anulaciones.',
    //     codigo_producto: data.codigo_producto,
    //     tipo_producto: this.letrasIdentificacion,
    //   },
    // });
  }

  editCompany(data: any){
    this.router.navigate([`/compania/${data.id}`]);
  }

  openPolizasPage(data: any){
    this.router.navigate([`/compania/${data.id}/polizas`]);
  }
}
