import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductsService } from '../../services/products.service';

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

  constructor (
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) {

  }

  agInit(params: any): void {
    this.data = params.data;
    this.route.paramMap.subscribe(params => {
      this.letrasIdentificacion = params.get('product')!;
    });
  }

  descargarSeguro(id : any) {
    console.log('Descargando: ',id)
    this.productsService.downloadPlantilla(this.letrasIdentificacion, id).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
  
        // Crear un enlace <a> en el DOM para iniciar la descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
  
        // Establecer el nombre de archivo para la descarga
        const nombreArchivo = 'documento.pdf';
        a.download = nombreArchivo;
  
        // Adjuntar el enlace al cuerpo del documento y simular clic en el enlace
        document.body.appendChild(a);
        a.click();
  
        // Limpiar y liberar recursos
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      error: (error: any) => {
        console.error('Error downloading the file', error);
      }
    });
  }
}

