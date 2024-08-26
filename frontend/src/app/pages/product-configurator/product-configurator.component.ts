import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProductsService } from '../../services/products.service';
import { FamilyProductService } from '../../services/family-product.service';
import { ErrorDialogComponent } from '../../components/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RatesService } from '../../services/rates.service';
import { Tarifa } from '../../interfaces/tarifa';
import { SocietyService } from '../../services/society.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { appConfig } from '../../app.config';
import { AppConfig } from '../../../config/app-config';


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
  imports: [SpinnerComponent, CommonModule, FormsModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule, MatCheckboxModule , ErrorDialogComponent],
  templateUrl: './product-configurator.component.html',
  styleUrl: './product-configurator.component.css'
})
export class ProductConfiguratorComponent {
  tiposDato = [{ nombre: 'Texto', value: 'text' }, { nombre: 'Número', value: 'number' }, { nombre: 'Fecha', value: 'date' }, { nombre: 'Decimal', value: 'decimal' }];
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

  cargandoNuevoProducto : boolean = false;
  tiposProductos : any[] = [];
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

  constructor(
    private productService : ProductsService,
    private familyService : FamilyProductService,
    public dialog: MatDialog,
    private ratesService : RatesService,
    private societyService : SocietyService
  ) {
    this.familyService.getAllTipos().subscribe((tiposProducto : any) => {
      this.tiposProductos = tiposProducto;
    },
    (error) => {
      console.log(error)
    });
  }

  camposGenerales : Campo[] = [
    { nombre: 'Codigo producto', tipoDato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_generales'},
    { nombre: 'Sociedad', tipoDato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_generales'},
    { nombre: 'Comercial', tipoDato: 'text', fila: '',columna: '', visible: false, obligatorio: true, grupo: 'datos_generales'},
    { nombre: 'Tipo de pago', tipoDato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_generales'},
    { nombre: 'Prima del seguro', tipoDato: 'text', fila: '',columna: '', visible: false, obligatorio: true, grupo: 'datos_generales'},
    { nombre: 'Cuota de asociación', tipoDato: 'text', fila: '',columna: '', visible: false, obligatorio: true, grupo: 'datos_generales'},
    { nombre: 'Precio Total', tipoDato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_generales'},
    { nombre: 'Numero anexos', tipoDato: 'number', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_generales'},
  ]

  camposAsegurado: Campo[] = [
    { nombre: 'DNI', tipoDato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_asegurado'},
    { nombre: 'Nombre socio', tipoDato: 'text', fila: '',columna: '', visible: true, obligatorio:true, grupo: 'datos_asegurado' },
    { nombre: 'Apellido 1', tipoDato: 'text',fila: '',columna: '', visible: true, obligatorio: false, grupo: 'datos_asegurado' },
    { nombre: 'Apellido 2', tipoDato: 'text',fila: '',columna: '', visible: true, obligatorio: false, grupo: 'datos_asegurado' },
    { nombre: 'Email', tipoDato: 'text',fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_asegurado' },
    { nombre: 'Telefono', tipoDato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_asegurado' },
    { nombre: 'Sexo', tipoDato: 'text', fila: '',columna: '', visible: false, obligatorio: true, grupo: 'datos_asegurado' },
    { nombre: 'Dirección', tipoDato: 'text',fila: '',columna: '', visible: false, obligatorio:false, grupo: 'datos_asegurado' },
    { nombre: 'Población', tipoDato: 'text',fila: '',columna: '', visible: false, obligatorio: false, grupo: 'datos_asegurado' },
    { nombre: 'Provincia', tipoDato: 'text', fila: '',columna: '', visible: true, obligatorio: false, grupo: 'datos_asegurado'},
    { nombre: 'Codigo Postal', tipoDato: 'number', fila: '',columna: '', visible: false, obligatorio: false, grupo: 'datos_asegurado' },
    { nombre: 'Fecha de nacimiento', tipoDato: 'date', fila: '',columna: '', visible: false, obligatorio: true, grupo: 'datos_asegurado'},
  ];
  campos: Campo[] = [{ nombre: '', tipoDato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_producto' }];

  agregarCampo() {
    this.campos.push({ nombre: '', tipoDato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_producto' });
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

    
    const camposFormulario = [...this.camposGenerales, ...this.camposAsegurado, ...this.campos]; // Concatenación de campos fijos y variables

    const campoFormatoFilasColumnasIncorrecto = this.formatoIncorrectoFilasColumnas(camposFormulario);

    const campoUsoCaracteresEspeciales = this.usoCaracteresEspeciales();

    if(this.campoVariableVacio()) {
        
      this.showErrorDialog('Hay un campo variable con el nombre vacío');
  
    } else if(this.letrasIdentificacionEnUso()) {

      this.showErrorDialog('Las letras de identificación seleccionadas ya están siendo usadas por otro producto');

    }else if(this.plantillaEnUso()) {

      this.showErrorDialog('El nombre de la plantilla seleccionada ya está siendo usado por otro producto');

    } else if(campoUsoCaracteresEspeciales){

      this.showErrorDialog('No está permitido el uso de caracteres especiales. Campo: '+ campoUsoCaracteresEspeciales);

    } else if(campoFormatoFilasColumnasIncorrecto) {

      this.showErrorDialog('El formato de las filas o columnas no es correcto en el campo: ' + campoFormatoFilasColumnasIncorrecto);

    } else if(this.tarifasVacias()) {

      this.showErrorDialog('Hay tarifas sin rellenar');

    } else if(this.plantillaVacia()) {
        
      this.showErrorDialog('Por favor, seleccione una plantilla');

    } else {
      this.cargandoNuevoProducto = true;

      const nuevoProducto = {
        nombreProducto: this.nombreProducto,
        letrasIdentificacion: this.letrasIdentificacion,
        campos: camposFormulario
      };

      console.log(nuevoProducto);
      
      this.productService.crearTipoProducto(nuevoProducto).subscribe((res) => {

        // La respuesta contiene la información del nuevo tipo de producto
        const id_tipo_producto = res.id.toString();
        console.log(res);
        this.productService.subirPlantilla(this.letrasIdentificacion, this.selectedFile).subscribe((res:any) => {
          console.log(res);
        });
        const tarifaNuevoProducto: Tarifa = {
          tipo_producto_id: id_tipo_producto,
          id_sociedad: AppConfig.SOCIEDAD_ADMIN_ID,
          prima_seguro: this.tarifas[0].valor.replace(',', '.'),
          cuota_asociacion: this.tarifas[1].valor.replace(',', '.'),
          precio_total: this.tarifas[2].valor.replace(',', '.')
        };
        
        this.ratesService.setTarifasPorSociedadAndTipoProducto(tarifaNuevoProducto).subscribe((res:any) => {
          console.log(res);
          this.societyService.connectSocietyWithTipoProducto(AppConfig.SOCIEDAD_ADMIN_ID, id_tipo_producto).subscribe((res:any) => {
            console.log(res);
            // Recargar la pagina:
            window.location.reload();
          });
        });
      },
      (error) => {
        console.log(error);
      });

    }
  }


  //Funcion para comprobar que la plantilla no se esté usando ya en otro tipo de producto:
  private plantillaEnUso() {
    //Recorremos el array de tipos de productos y comparamos plantilla_path con el nombre del archivo seleccionado  
    for (let i = 0; i < this.tiposProductos.length; i++) {
      if (this.tiposProductos[i].plantilla_path === "plantillas/"+this.fileName) {
        return true;
      }
    }
    return false;  
  }

  private plantillaVacia() {
    return this.selectedFile === undefined
  }

  private letrasIdentificacionEnUso() {
    //Recorremos el array de tipos de productos y comparamos letras_identificacion con el nombre del archivo seleccionado
    for (let i = 0; i < this.tiposProductos.length; i++) {
      if (this.tiposProductos[i].letras_identificacion === this.letrasIdentificacion) {
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


