import { Component } from '@angular/core';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorDialogComponent } from '../../components/error-dialog/error-dialog.component';

interface CampoAnexo {
  nombre: string;
  tipoDato: string;
  fila: string;
  columna: string;
  obligatorio: boolean;
}

@Component({
  selector: 'app-anexos-configurator',
  standalone: true,
  imports: [SpinnerComponent, CommonModule, FormsModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule, MatCheckboxModule , ErrorDialogComponent],
  templateUrl: './anexos-configurator.component.html',
  styleUrl: './anexos-configurator.component.css'
})
export class AnexosConfiguratorComponent {
  tiposDato = [{ nombre: 'Texto', value: 'text' }, { nombre: 'Número', value: 'number' }, { nombre: 'Fecha', value: 'date' }, { nombre: 'Decimal', value: 'decimal' }];

  campos: CampoAnexo[] = [{ nombre: '', tipoDato: 'text', fila: '',columna: '' , obligatorio: false}];

  agregarCampo() {
    this.campos.push({ nombre: '', tipoDato: 'text', fila: '',columna: '', obligatorio: false });
  }

  eliminarCampo(index: number) {
    this.campos.splice(index, 1);
  }
}
