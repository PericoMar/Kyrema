import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProductsService } from '../../services/products.service';


interface Campo {
  nombre: string;
  tipoDato: string;
  fila: string;
  columna: string,
  visible: boolean;
  obligatorio: boolean;
  grupo: string;
}

@Component({
  selector: 'app-product-configurator',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './product-configurator.component.html',
  styleUrl: './product-configurator.component.css'
})
export class ProductConfiguratorComponent {
  fileName = '';
  selectedFile! : File;
  nombreProducto = '';
  letrasIdentificacion = '';
  nuevoProducto : any = {
    nombreProducto: '',
    letrasIdentificacion: '',
    plantilla: null,
    campos: []
  };

  constructor(private productService : ProductsService) {}

  camposFijos: Campo[] = [
    { nombre: 'DNI', tipoDato: 'texto', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_asegurado'},
    { nombre: 'Nombre socio', tipoDato: 'texto', fila: '',columna: '', visible: true, obligatorio:true, grupo: 'datos_asegurado' },
    { nombre: 'Apellido 1', tipoDato: 'texto',fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_asegurado' },
    { nombre: 'Apellido 2', tipoDato: 'texto',fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_asegurado' },
    { nombre: 'Email', tipoDato: 'texto',fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_asegurado' },
    { nombre: 'Telefono', tipoDato: 'texto', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_asegurado' },
    { nombre: 'Sexo', tipoDato: 'texto', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_asegurado' },
    { nombre: 'Dirección', tipoDato: 'texto',fila: '',columna: '', visible: true, obligatorio:true, grupo: 'datos_asegurado' },
    { nombre: 'Población', tipoDato: 'texto',fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_asegurado' },
    { nombre: 'Provincia', tipoDato: 'texto', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_asegurado'},
    { nombre: 'Codigo Postal', tipoDato: 'numero', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_asegurado' },
    { nombre: 'Fecha de nacimiento', tipoDato: 'fecha', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_asegurado'},
  ];
  campos: Campo[] = [{ nombre: '', tipoDato: 'texto', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_producto' }];

  agregarCampo() {
    this.campos.push({ nombre: '', tipoDato: 'texto', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_producto' });
  }

  eliminarCampo(index: number) {
    this.campos.splice(index, 1);
  }

  onFileSelected(event : any) {

    const file:File = event.target.files.item(0);
    this.selectedFile = file;

    if (file) {

        this.fileName = file.name;

        console.log(this.fileName);
    }
  }

  crearTipoProducto() {
    const camposFormulario = [...this.camposFijos, ...this.campos]; // Concatenación de campos fijos y variables

    const nuevoProducto = {
      nombreProducto: this.nombreProducto,
      letrasIdentificacion: this.letrasIdentificacion,
      campos: camposFormulario
    };

    console.log(nuevoProducto);
    
    this.productService.crearTipoProducto(nuevoProducto).subscribe((res) => {
      console.log(res);
      this.productService.subirPlantilla(this.letrasIdentificacion, this.selectedFile).subscribe((res:any) => {
        console.log(res);
      });
    },
    (error) => {
      console.log(error);
    });
  }

}
