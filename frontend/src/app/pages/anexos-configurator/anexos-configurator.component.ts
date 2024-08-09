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
import { FamilyProductService } from '../../services/family-product.service';
import { MatDialog } from '@angular/material/dialog';
import { AnexosService } from '../../services/anexos.service';
import { RatesService } from '../../services/rates.service';
import { AppConfig } from '../../../config/app-config';

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


  constructor(
    private familyService: FamilyProductService,
    private dialog: MatDialog,
    private anexosService: AnexosService,
    private ratesService : RatesService
  ) {
    this.familyService.getAllTipos().subscribe((tiposProducto : any) => {
      this.tiposProductos = tiposProducto;
    },
    (error) => {
      console.log(error)
    });

    this.anexosService.getAllTiposAnexos().subscribe((tiposAnexos : any) => {
      this.tiposAnexos = tiposAnexos;
    },
    (error : any) => {
      console.log(error)
    });
   }

  tiposProductos: any[] = [];
  tiposAnexos: any[] = [];
  tipoProductoAsociado = '';
  nombreAnexo = '';
  letrasIdentificacion = '';

  cargandoNuevoAnexo : boolean = false;
  tiposDato = [{ nombre: 'Texto', value: 'text' }, { nombre: 'Número', value: 'number' }, { nombre: 'Fecha', value: 'date' }, { nombre: 'Decimal', value: 'decimal' }];
  tarifas : any[] = [
    {
      id: 1,
      nombre : "Prima del seguro",
      codigo: "prima_del_seguro",
      valor: ""
    },
    {
      id: 2,
      nombre : "Cuota de asociación",
      codigo: "cuota_de_asociacion",
      valor: ""
    },
    {
      id: 3,
      nombre : "Precio Total",
      codigo: "precio_total",
      valor: ""
    }
  ];

  campos: CampoAnexo[] = [{ nombre: '', tipoDato: 'text', fila: '',columna: '' , obligatorio: false}];

  agregarCampo() {
    this.campos.push({ nombre: '', tipoDato: 'text', fila: '',columna: '', obligatorio: false });
  }

  eliminarCampo(index: number) {
    this.campos.splice(index, 1);
  }

  crearTipoAnexo(){
    this.cargandoNuevoAnexo = true;
    const campoFormatoFilasColumnasIncorrecto = this.formatoIncorrectoFilasColumnas(this.campos);

    const campoUsoCaracteresEspeciales = this.usoCaracteresEspeciales();

    const campoFilaColumnaRepetida = this.filaColumnaYaEnUso(this.campos);

    if(this.campoVariableVacio()) {
        
      this.showErrorDialog('Hay un campo variable con el nombre vacío');
  
    } else if(this.letrasIdentificacionEnUso()) {

      this.showErrorDialog('Las letras de identificación seleccionadas ya están siendo usadas por otro producto');

    }else if(campoUsoCaracteresEspeciales){

      this.showErrorDialog('No está permitido el uso de caracteres especiales. Campo: '+ campoUsoCaracteresEspeciales);

    } else if(campoFormatoFilasColumnasIncorrecto) {

      this.showErrorDialog('El formato de las filas o columnas no es correcto en el campo: ' + campoFormatoFilasColumnasIncorrecto);

    } else if(this.tarifasVacias()) {

      this.showErrorDialog('Hay tarifas sin rellenar');

    } else if(campoFilaColumnaRepetida){

      this.showErrorDialog('La fila y columna del campo: ' + campoFilaColumnaRepetida + ' ya están siendo usadas');

    } else {
      const nuevoTipoAnexo = {
        nombre: this.nombreAnexo,
        letras_identificacion: this.letrasIdentificacion,
        campos: this.campos,
        tipoProductoAsociado: this.tipoProductoAsociado,
      }

      this.anexosService.createTipoAnexo(nuevoTipoAnexo).subscribe((response: any) => {
        console.log(response);

        const tarifaAnexo = {
          id_tipo_anexo: response.id,
          prima_seguro: this.tarifas[0].valor,
          cuota_asociacion: this.tarifas[1].valor,
          precio_total: this.tarifas[2].valor,
          id_sociedad: AppConfig.SOCIEDAD_ADMIN_ID
        }

        this.ratesService.setTarifaPorSociedadAndTipoAnexo(tarifaAnexo).subscribe((response: any) => {
          console.log(response);
          this.cargandoNuevoAnexo = false;
        });
      },
      (error : any) => {
        console.log(error);
      });
    }
  }

  private letrasIdentificacionEnUso() {
    //Recorremos el array de tipos de productos y comparamos letras_identificacion con el nombre del archivo seleccionado
    for (let i = 0; i < this.tiposProductos.length; i++) {
      if (this.tiposProductos[i].letras_identificacion === this.letrasIdentificacion) {
        return true;
      }
    }
    for(let i = 0; i < this.tiposAnexos.length; i++) {
      if(this.tiposAnexos[i].letras_identificacion === this.letrasIdentificacion) {
        return true;
      }
    }
    return false;
  }

  private formatoIncorrectoFilasColumnas(camposFormulario: CampoAnexo[]): string | boolean {
    for (const campo of camposFormulario) {
        // Comprobar si las columnas son solo letras y las filas son solo números (Como en Excel)
        if (!(/^[a-zA-Z]*$/.test(campo.columna)) || !(/^[0-9]*$/.test(campo.fila))) {
            return campo.nombre; // Devuelve el nombre del campo con formato incorrecto
        }
    }
    return false; // Devuelve false si todos los campos tienen el formato correcto
  }

  private filaColumnaYaEnUso(camposFormulario: CampoAnexo[]): string | boolean {
    const campos = camposFormulario.filter(campo => campo.fila !== '' && campo.columna !== '');
    const camposUnicos = new Set();
    for (const campo of campos) {
        const filaColumna = campo.fila + campo.columna;
        // Comprueba si la fila y columna ya están siendo usadas
        if (camposUnicos.has(filaColumna)) {
            return campo.nombre; // Devuelve el nombre del campo con fila y columna repetidas
        }
        camposUnicos.add(filaColumna);
    }
    return false; // Devuelve false si no hay filas y columnas repetidas
  }

  private usoCaracteresEspeciales(): string | boolean {
    // Expresión regular para caracteres especiales, permitiendo espacios
    const caracteresEspeciales = /[!@#\$%\^\&*\)\(+=._-]+/g;

    for (const campo of this.campos) {
        // Verifica si el campo contiene caracteres especiales (excluyendo espacios)
        if (caracteresEspeciales.test(campo.nombre)) {
            return campo.nombre;
        }
    }
    return false;
  }

  private campoVariableVacio() : boolean {
    for(const campo of this.campos) {
      if(campo.nombre === '') {
        return true;
      }
    }
    return false;
  }

  private tarifasVacias() : boolean {
    for(const tarifa of this.tarifas) {
      if(tarifa.valor === '') {
        return true;
      }
    }
    return false;
  }


  showErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      width: '300px',
      data: { message }
    });
  }
}
