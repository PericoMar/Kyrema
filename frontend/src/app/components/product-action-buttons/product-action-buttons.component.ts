import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { SnackBarService } from '../../services/snackBar/snack-bar.service';
import { SocietyService } from '../../services/society.service';
import { AppConfig } from '../../../config/app-config';

@Component({
  selector: 'app-product-action-buttons',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './product-action-buttons.component.html',
  styleUrl: './product-action-buttons.component.css'
})
export class ProductActionButtonsComponent {
  public data: any;
  letrasIdentificacion: any;

  currentSociety: any;
  society_admin_id = AppConfig.SOCIEDAD_ADMIN_ID;

  constructor (
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBarService: SnackBarService,
    private societyService: SocietyService,
  ) {

  }

  agInit(params: any): void {
    this.currentSociety = this.societyService.getCurrentSociety();
    this.data = params.data;
    this.route.paramMap.subscribe(params => {
      this.letrasIdentificacion = params.get('product')!;
    });
  }

  descargarSeguro(producto: any) {
    // Poner el cursor en modo de espera
    document.body.classList.add('wait-cursor');

    // Seleccionar el contenedor de descarga específico por ID
    const downloadIcon = document.getElementById(`download-icon-${producto.id}`) as HTMLElement;
    const loader = document.getElementById(`loader-${producto.id}`) as HTMLElement;
    
    // Añadir la clase 'active' para mostrar el loader y reducir el tamaño del icono
    if (downloadIcon) {
        downloadIcon.classList.add('active');
    }

    this.productsService.downloadPlantilla(this.letrasIdentificacion, producto.id).subscribe({
        next: (response: Blob) => {
            const blob = new Blob([response], { type: 'application/pdf' });

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Construir partes del nombre del archivo, verificando que existan.
            const nombreSocio = producto.nombre_socio ? `_${producto.nombre_socio}` : '';
            const apellido1 = producto.apellido_1 ? `_${producto.apellido_1}` : '';
            const apellido2 = producto.apellido_2 ? `_${producto.apellido_2}` : '';

            // Nombre del archivo final
            const nombreArchivo = `${producto.codigo_producto}${nombreSocio}${apellido1}${apellido2}.pdf`;

            a.download = nombreArchivo;


            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        },
        error: (error: Error) => {
            this.snackBarService.openSnackBar(error.message, 'Cerrar', 6000);
        },
        complete: () => {
            // Eliminar la clase 'active' cuando la descarga se complete (éxito o error)
            if (downloadIcon) {
                downloadIcon.classList.remove('active');
            }

            // Restaurar el cursor a su estado normal
            document.body.classList.remove('wait-cursor');
        }
    });
}




  openDeleteDialog(data : any){
    this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data : {
        id: data.id,
        message: '¿Estás seguro que deseas anular el siguiente producto?',
        secondary_msg: 'Se guardará en la tabla de anulaciones.',
        codigo_producto: data.codigo_producto,
        tipo_producto: this.letrasIdentificacion,
      },
    });
  }
}


