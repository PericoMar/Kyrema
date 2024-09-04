import { Component } from '@angular/core';
import { ErrorDialogComponent } from '../../components/error-dialog/error-dialog.component';
import { FamilyProductService } from '../../services/family-product.service';
import { MatDialog } from '@angular/material/dialog';
import { RatesService } from '../../services/rates.service';
import { AnexosService } from '../../services/anexos.service';
import { AppConfig } from '../../../config/app-config';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';


interface Campo {
  id? : string;
  nombre: string;
  tipo_dato: string;
  fila: string;
  columna: string,
  visible: boolean;
  obligatorio: boolean;
  grupo: string;
  opciones: {id:string , nombre: string, precio: string, created_at?:string, updated_at?: string}[];
}

@Component({
  selector: 'app-subproduct-configurator',
  standalone: true,
  imports: [SpinnerComponent, CommonModule, FormsModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule, MatCheckboxModule , ErrorDialogComponent],
  templateUrl: './subproduct-configurator.component.html',
  styleUrl: './subproduct-configurator.component.css'
})

export class SubproductConfiguratorComponent {
  
  constructor(
    private familyService: FamilyProductService,
    private dialog: MatDialog,
    private productsService: ProductsService,
    private ratesService : RatesService,
    private route: ActivatedRoute
  ) {
    this.familyService.getAllTipos().subscribe((tiposProducto : any) => {
      this.tiposProductos = tiposProducto;
      this.tipoProductoAsociado = this.tiposProductos.find((tipo : any) => tipo.id == this.padre_id);
      console.log(this.tipoProductoAsociado);
    },
    (error) => {
      console.log(error)
    });

    this.familyService.getAllTipos().subscribe((tiposAnexos : any) => {
      this.tiposAnexos = tiposAnexos;
    },
    (error : any) => {
      console.log(error)
    });

    this.route.paramMap.subscribe(params => {
      this.padre_id = params.get('producto-asociado');
      this.subprodcuto_id = params.get('id');
      
    });
   }

  subprodcuto_id! : any;
  id_tipo_producto! : any;
  
  fileName = '';
  selectedFile! : File;

  tiposProductos: any[] = [];
  tiposAnexos: any[] = [];
  tipoProductoAsociado = '';
  padre_id! : any;
  nombreSubproducto = '';
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

  tarifasHeredadas: boolean = false;

  campos: Campo[] = [{ id:'', nombre: '', tipo_dato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_producto' , opciones: []}];

  agregarCampo() {
    this.campos.push({ id:'', nombre: '', tipo_dato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_producto' , opciones: []});
  }

  eliminarCampo(index: number) {
    this.campos.splice(index, 1);
  }

  crearSubproducto(){
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

    } else if(this.tarifasVacias() && !this.tarifasHeredadas) {

      this.showErrorDialog('Hay tarifas sin rellenar');

    } else if(campoFilaColumnaRepetida){

      this.showErrorDialog('La fila y columna del campo: ' + campoFilaColumnaRepetida + ' ya están siendo usadas');

    } else {
      const nuevoSubproducto = {
        nombre: this.nombreSubproducto,
        plantilla_path: this.selectedFile,
        letras_identificacion: AppConfig.PREFIJO_LETRAS_IDENTIFICACION_ANEXOS + this.letrasIdentificacion,
        campos: this.campos,
        padre_id: this.padre_id,
      }

      this.productsService.crearTipoProducto(nuevoSubproducto).subscribe((response: any) => {
        console.log(response);

        this.productsService.subirPlantilla(response.letras_identificacion, this.selectedFile).subscribe((response: any) => {
          console.log(response);
        });

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

  changeOnHeredadas(event : any) {
    this.tarifasHeredadas = !this.tarifasHeredadas;
  }

  // VERIFICAR FORMULARIO:
  verificarCampos(camposFormulario: any[], editando : boolean): boolean {

    
    const campoFormatoFilasColumnasIncorrecto = this.formatoIncorrectoFilasColumnas(camposFormulario);
    const campoUsoCaracteresEspeciales = this.usoCaracteresEspeciales();
    // const campoConOpcionesRepetidas = this.campoConOpcionesRepetidas(camposFormulario);
    // const campoConOpcionPrecioFormatoIncorrecto = this.precioOpcionesFormatoIncorrecto(camposFormulario);
  
    if (this.campoVariableVacio()) {
      this.showErrorDialog('Hay un campo variable con el nombre vacío');
      return false;
    } 
    
    if (this.letrasIdentificacionEnUso() && !editando) {
      this.showErrorDialog('Las letras de identificación seleccionadas ya están siendo usadas por otro producto');
      return false;
    }
    
    if (this.plantillaEnUso() && !editando) {
      this.showErrorDialog('El nombre de la plantilla seleccionada ya está siendo usado por otro producto');
      return false;
    }
    
    if (campoUsoCaracteresEspeciales) {
      this.showErrorDialog('No está permitido el uso de caracteres especiales. Campo: ' + campoUsoCaracteresEspeciales);
      return false;
    }
    
    if (campoFormatoFilasColumnasIncorrecto) {
      this.showErrorDialog('El formato de las filas o columnas no es correcto en el campo: ' + campoFormatoFilasColumnasIncorrecto);
      return false;
    }
    
    if (this.tarifasVacias() && !editando) {
      this.showErrorDialog('Hay tarifas sin rellenar');
      return false;
    }
    
    if (this.plantillaVacia() && !editando) {
      this.showErrorDialog('Por favor, seleccione una plantilla');
      return false;
    }
    
    if (this.tarifasFormatoIncorrecto() && !editando) {
      this.showErrorDialog('El formato de las tarifas no es correcto');
      return false;
    }
    
    if (this.nombreCamposRepetidos()) {
      this.showErrorDialog('Hay campos con el mismo nombre');
      return false;
    }
    
    // if (campoConOpcionesRepetidas) {
    //   this.showErrorDialog('El campo selector ' + campoConOpcionesRepetidas.nombre + ' tiene opciones repetidas');
    //   return false;
    // }
    
    // if (campoConOpcionPrecioFormatoIncorrecto) {
    //   this.showErrorDialog('El precio de las opciones del campo selector ' + campoConOpcionPrecioFormatoIncorrecto.nombre + ' no tiene un formato correcto');
    //   return false;
    // }
  
    return true;
  }

  // private campoConOpcionesRepetidas(campos: any): any {
  //   for (const campo of campos) {
  //     const nombres = campo.opciones.map((opcion : any) => opcion.nombre);
  //     const nombresSet = new Set(nombres);
      
  //     // Si el tamaño del Set es menor que el array original, hay elementos duplicados
  //     if (nombresSet.size !== nombres.length) {
  //       return campo; // Retorna el campo con opciones repetidas
  //     }
  //   }
    
  //   return null; // Si no se encuentran campos con opciones repetidas, retorna null
  // }

  // private precioOpcionesFormatoIncorrecto(campos: Campo[]) : Campo | null {
  //   const formatoNumerico = /^\d+([.,]\d+)?$/;
  //   for(const campo of campos) {
  //     if(campo.tipo_dato === 'select') {
  //       for(const opcion of campo.opciones) {
  //         if(!formatoNumerico.test(opcion.precio)) {
  //           return campo;
  //         }
  //       }
  //     }
  //   }
  //   return null;
  // }

  private plantillaVacia() {
    return this.selectedFile === undefined
  }

  private tarifasFormatoIncorrecto(): boolean {
    for (let tarifa of this.tarifas) {
      const valor = tarifa.valor;
        
      // Expresión regular para validar formato numérico, permite números con coma o punto decimal
      const formatoNumerico = /^\d+([.,]\d+)?$/;
  
      if (!formatoNumerico.test(valor)) {
        return true; // Retorna true si se encuentra un valor con formato incorrecto
      }
    }
    
    return false; // Si todas las tarifas tienen formato correcto, retorna false
  }

  nombreCamposRepetidos() {
    const nombres = this.campos.map((campo) => campo.nombre);
    return nombres.some((nombre, index) => nombres.indexOf(nombre) !== index);
  }


  private letrasIdentificacionEnUso() {
    //Recorremos el array de tipos de productos y comparamos letras_identificacion con el nombre del archivo seleccionado
    for (let i = 0; i < this.tiposProductos.length; i++) {
      if (this.tiposProductos[i].letras_identificacion === this.letrasIdentificacion) {
        return true;
      }
    }
    for(let i = 0; i < this.tiposAnexos.length; i++) {
      if(this.tiposAnexos[i].letras_identificacion === AppConfig.PREFIJO_LETRAS_IDENTIFICACION_ANEXOS + this.letrasIdentificacion) {
        return true;
      }
    }
    return false;
  }

  private formatoIncorrectoFilasColumnas(camposFormulario: Campo[]): string | boolean {
    for (const campo of camposFormulario) {
        // Comprobar si las columnas son solo letras y las filas son solo números (Como en Excel)
        if (!(/^[a-zA-Z]*$/.test(campo.columna)) || !(/^[0-9]*$/.test(campo.fila))) {
            return campo.nombre; // Devuelve el nombre del campo con formato incorrecto
        }
    }
    return false; // Devuelve false si todos los campos tienen el formato correcto
  }
  
  private plantillaEnUso(){
    for (let i = 0; i < this.tiposAnexos.length; i++) {
      if (this.tiposProductos[i].plantilla_path === "plantillas/anexos/"+this.fileName) {
        return true;
      }
    }
    return false;
  }

  private filaColumnaYaEnUso(camposFormulario: Campo[]): string | boolean {
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

  onFileSelected(event : any) {

    const file:File = event.target.files.item(0);
    this.selectedFile = file;

    if (file) {

        this.fileName = file.name;

        console.log(this.fileName);
    }
  }
}
