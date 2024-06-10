import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface Campo {
  nombre: string;
  tipoDato: string;
  fila: string;
  columna: string,
  visible: boolean;
  obligatorio: boolean;
}

@Component({
  selector: 'app-product-configurator',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './product-configurator.component.html',
  styleUrl: './product-configurator.component.css'
})
export class ProductConfiguratorComponent {
  camposFijos: Campo[] = [
    { nombre: 'DNI', tipoDato: 'texto', fila: '',columna: '', visible: false, obligatorio: false },
    { nombre: 'Nombre socio', tipoDato: 'texto', fila: '',columna: '', visible: false, obligatorio: true },
    { nombre: 'Apellido 1', tipoDato: 'texto',fila: '',columna: '', visible: false, obligatorio: false },
    { nombre: 'Apellido 2', tipoDato: 'texto',fila: '',columna: '', visible: false, obligatorio: false },
    { nombre: 'Email', tipoDato: 'texto',fila: '',columna: '', visible: false, obligatorio: false },
    { nombre: 'Telefono', tipoDato: 'texto', fila: '',columna: '', visible: false, obligatorio: false },
    { nombre: 'Sexo', tipoDato: 'texto', fila: '',columna: '', visible: false, obligatorio: false },
    { nombre: 'Dirección', tipoDato: 'texto',fila: '',columna: '', visible: false, obligatorio: false },
    { nombre: 'Población', tipoDato: 'texto',fila: '',columna: '', visible: false, obligatorio: false },
    { nombre: 'Provincia', tipoDato: 'texto', fila: '',columna: '', visible: false, obligatorio: false },
    { nombre: 'Codigo Postal', tipoDato: 'numero', fila: '',columna: '', visible: false, obligatorio: false },
    { nombre: 'Fecha de nacimiento', tipoDato: 'fecha', fila: '',columna: '', visible: false, obligatorio: false},
  ];
  campos: Campo[] = [{ nombre: '', tipoDato: 'texto', fila: '',columna: '', visible: false, obligatorio: false }];

  agregarCampo() {
    this.campos.push({ nombre: '', tipoDato: 'texto', fila: '',columna: '', visible: false, obligatorio: false });
  }

  eliminarCampo(index: number) {
    this.campos.splice(index, 1);
  }
}
