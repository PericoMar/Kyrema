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
import { AppConfig } from '../../../config/app-config';
import { CamposService } from '../../services/campos.service';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from '../../services/snackBar/snack-bar.service';
import { AnexosService } from '../../services/anexos.service';


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
  selector: 'app-product-configurator',
  standalone: true,
  imports: [SpinnerComponent, CommonModule, FormsModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule, MatCheckboxModule , ErrorDialogComponent],
  templateUrl: './product-configurator.component.html',
  styleUrl: './product-configurator.component.css'
})
export class ProductConfiguratorComponent {
  tiposDato = [{ nombre: 'Texto', value: 'text' }, { nombre: 'Número', value: 'number' }, { nombre: 'Fecha', value: 'date' }, { nombre: 'Decimal', value: 'decimal' }, { nombre: 'Selector', value: 'select' }];
  // a.	Diario
  // b.	Anual
  // c.	Días delimitados
  // d.	Selector de días
  // e.	Fecha exacta
  tiposDuracion = [{ nombre: 'Diario - 1día', value: 'diario' }, {nombre: 'Mensual - 30días' , value: 'mensual'}, { nombre: 'Anual - 365días', value: 'anual' }, { nombre: 'Días delimitados', value: 'dias_delimitados' }, { nombre: 'Selector de días', value: 'selector_dias' }, { nombre: 'Fecha exacta', value: 'fecha_exacta' }]; 


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
  tiposAnexos : any[] = [];

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

  camposTiempo : Campo[] = [];
  camposGenerales : Campo[] = [];
  camposAsegurado : Campo[] = [];
  campos : Campo[] = [];

  id_tipo_producto_editado : string | null = null;

  letrasDisabled : boolean = false;

  constructor(
    private productService : ProductsService,
    private familyService : FamilyProductService,
    private anexosService: AnexosService,
    public dialog: MatDialog,
    private ratesService : RatesService,
    private societyService : SocietyService,
    private camposService : CamposService,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService
  ) {
    this.familyService.getAllTipos().subscribe((tiposProducto : any) => {
      this.tiposProductos = tiposProducto;
    },
    (error) => {
      console.log(error)
    });
    this.anexosService.getAllTiposAnexos().subscribe((tiposAnexos : any) => {
      console.log(tiposAnexos);
      this.tiposAnexos = tiposAnexos;
    },
    (error : any) => {
      console.log(error)
    });


    // Coger por la ruta el id del tipo de producto:
    this.route.paramMap.subscribe(params => {
      this.id_tipo_producto_editado = params.get('id');
      console.log(this.id_tipo_producto_editado);
      if(this.id_tipo_producto_editado) {
        this.familyService.getTipoProductoPorId(this.id_tipo_producto_editado).subscribe((tipoProducto) => {
          this.nombreProducto = tipoProducto.nombre;
          this.letrasIdentificacion = tipoProducto.letras_identificacion;
          this.fileName = tipoProducto.plantilla_path;
          // Poner el campo de letrasIdentificacion como disabled
          this.letrasDisabled = true;
        });


        this.camposService.getCamposPorTipoProducto(this.id_tipo_producto_editado).subscribe((campos) => {
          // Cada campo tiene un campo 'grupo' dependiendo de ese grupo se metera en el array camposGenerales, camposAsegurado o campos
          campos.forEach((campo : any) => {
            campo.obligatorio = campo.obligatorio == '1' ? true : false;
            campo.visible = campo.visible == '1' ? true : false;
            campo.fila = campo.fila ? campo.fila : '';
            campo.columna = campo.columna ? campo.columna : '';

            // Se tienen que separar los campos con opciones de los que no tienen para que no cargue el formulario con los campos con opciones vacíos
            if(campo.opciones !== null) {
              this.camposService.getOpcionesPorCampo(campo.id).subscribe((opciones) => {
                console.log(opciones);
                campo.opciones = opciones;
                this.campos.push(campo);
              });
            } else {
              if(campo.grupo === 'datos_generales') {
                this.camposGenerales.push(campo);
              } else if(campo.grupo === 'datos_asegurado') {
                this.camposAsegurado.push(campo);
              } else if(campo.grupo === 'datos_producto') {
                this.campos.push(campo);
              }
            }
          });
        });
      } else {
        this.camposTiempo = [{ id: '', nombre: 'Duración del seguro', tipo_dato: 'diario', fila: '',columna: '', visible: false, obligatorio: true, grupo: 'datos_duracion', opciones: []}];

        this.camposGenerales= [
          { id: '', nombre: 'Codigo producto', tipo_dato: 'text', fila: '',columna: '', visible: true, obligatorio: false, grupo: 'datos_generales', opciones: []},
          { id: '', nombre: 'Fecha de inicio', tipo_dato: 'date', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_fecha', opciones: []},
          { id: '', nombre: 'Fecha de fin', tipo_dato: 'date', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_fecha', opciones: []},
          { id: '', nombre: 'Sociedad', tipo_dato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_generales', opciones: []},
          { id: '', nombre: 'Comercial', tipo_dato: 'text', fila: '',columna: '', visible: false, obligatorio: true, grupo: 'datos_generales', opciones: []},
          { id: '', nombre: 'Tipo de pago', tipo_dato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_generales', opciones: []},
          { id: '', nombre: 'Prima del seguro', tipo_dato: 'text', fila: '',columna: '', visible: false, obligatorio: true, grupo: 'datos_generales', opciones: []},
          { id: '', nombre: 'Cuota de asociación', tipo_dato: 'text', fila: '',columna: '', visible: false, obligatorio: true, grupo: 'datos_generales', opciones: []},
          { id: '', nombre: 'Precio Total', tipo_dato: 'text', fila: '',columna: '', visible: false, obligatorio: true, grupo: 'datos_generales', opciones: []},
          { id: '', nombre: 'Precio Final', tipo_dato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_generales', opciones: []},
          { id: '', nombre: 'Numero anexos', tipo_dato: 'number', fila: '',columna: '', visible: true, obligatorio: false, grupo: 'datos_generales', opciones: []},
        ]
      
        this.camposAsegurado = [
          { id: '', nombre: 'DNI', tipo_dato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_asegurado', opciones: []},
          { id: '', nombre: 'Nombre socio', tipo_dato: 'text', fila: '',columna: '', visible: true, obligatorio:true, grupo: 'datos_asegurado' , opciones: []},
          { id: '', nombre: 'Apellido 1', tipo_dato: 'text',fila: '',columna: '', visible: true, obligatorio: false, grupo: 'datos_asegurado' , opciones: []},
          { id: '', nombre: 'Apellido 2', tipo_dato: 'text',fila: '',columna: '', visible: true, obligatorio: false, grupo: 'datos_asegurado' , opciones: []},
          { id: '', nombre: 'Email', tipo_dato: 'text',fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_asegurado' , opciones: []},
          { id: '', nombre: 'Telefono', tipo_dato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_asegurado' , opciones: []},
          { id: '', nombre: 'Sexo', tipo_dato: 'text', fila: '',columna: '', visible: false, obligatorio: true, grupo: 'datos_asegurado' , opciones: []},
          { id: '', nombre: 'Dirección', tipo_dato: 'text',fila: '',columna: '', visible: false, obligatorio:false, grupo: 'datos_asegurado' , opciones: []},
          { id: '', nombre: 'Población', tipo_dato: 'text',fila: '',columna: '', visible: false, obligatorio: false, grupo: 'datos_asegurado' , opciones: []},
          { id: '', nombre: 'Provincia', tipo_dato: 'text', fila: '',columna: '', visible: true, obligatorio: false, grupo: 'datos_asegurado', opciones: []},
          { id: '', nombre: 'Codigo Postal', tipo_dato: 'number', fila: '',columna: '', visible: false, obligatorio: false, grupo: 'datos_asegurado' , opciones: []},
          { id: '', nombre: 'Fecha de nacimiento', tipo_dato: 'date', fila: '',columna: '', visible: false, obligatorio: true, grupo: 'datos_asegurado', opciones: []},
        ];
        this.campos = [{ id: '', nombre: '', tipo_dato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_producto', opciones: [] }];
      }
    });
    
  }

  

  agregarCampo() {
    this.campos.push({ id:'', nombre: '', tipo_dato: 'text', fila: '',columna: '', visible: true, obligatorio: true, grupo: 'datos_producto' , opciones: []});
  }

  eliminarCampo(index: number) {
    this.campos.splice(index, 1);
  }

  onTipoDatoChange(campo: any) {
    if (campo.tipo_dato === 'select' || campo.tipo_dato === 'selector_dias' || campo.tipo_dato === 'dias_delimitados') {
      // Inicializar el array de opciones si está indefinido
      if (campo.opciones.length === 0) {
        campo.opciones = [{id:'', nombre: '', precio: ''}];
      }
    } else {
      // Limpiar las opciones si el tipo de dato no es 'select'
      campo.opciones = [];
    }
  }

  agregarOpcion(campo: any) {
    // Verificar que el array de opciones esté inicializado
    if (!campo.opciones) {
      campo.opciones = [];
    }
    campo.opciones.push({id:'', nombre: '', precio: ''}); // Añadir una opción vacía
  }

  eliminarOpcion(campo: any, index: number) {
    if (campo.opciones) {
      campo.opciones.splice(index, 1); // Eliminar la opción en la posición `index`
    }
  }


  onFileSelected(event : any) {

    const file:File = event.target.files.item(0);
    this.selectedFile = file;

    if (file) {

        this.fileName = file.name;

        console.log(this.fileName);
    }
  }

  /* Función para crear un nuevo tipo de producto 
  /* Se comprueban los campos del formulario y
  /* se crea un objeto con los campos necesarios para crear un nuevo tipo de producto
  /* Se confirma si se esta editando o creando un nuevo tipo de producto
  /* Se envía la petición al servicio de productos para crear un nuevo tipo de producto
  */

  crearTipoProducto() {

    
    const camposFormulario = [...this.camposGenerales, ...this.camposAsegurado, ...this.campos]; // Concatenación de campos fijos y variables
    
    const editando : boolean = this.id_tipo_producto_editado ? true : false;

    // Poner todas los precios de las opciones de los campos con opciones vacios a 0
    camposFormulario.forEach((campo) => {
      if(campo.tipo_dato === 'select') {
        campo.opciones.forEach((opcion) => {
          if(opcion.precio === '') {
            opcion.precio = '0';
          }
        });
      }
    });

    // Verificar datos del formulario
    if (this.plantillaEnUso() && !editando) {

      this.showErrorDialog('El nombre de la plantilla seleccionada ya está siendo usado por otro producto');

    } else if(this.verificarCampos(camposFormulario, editando)) {
    

      this.cargandoNuevoProducto = true;

      const nuevoProducto = {
        nombreProducto: this.nombreProducto,
        letrasIdentificacion: AppConfig.PREFIJO_LETRAS_IDENTIFICACION + this.letrasIdentificacion,
        campos: camposFormulario
      };

      // Crear un array para guardar los campos con opciones
      const camposConOpciones : any[] = [];

      // Recorrer los campos y separar los que tienen opciones
      nuevoProducto.campos = nuevoProducto.campos.filter((campo) => {
        if (campo.opciones) {
          // Filtrar opciones vacías
          campo.opciones = campo.opciones.filter((opcion) => opcion.nombre !== '');
          
          // Si el campo tiene opciones y no tiene ID (es nuevo), lo movemos a `camposConOpciones`
          if (campo.opciones.length > 0) {
            camposConOpciones.push(campo);
            campo.opciones.forEach((opcion) => {
              // Comprobar el formato del precio y si tiene com cambiar por punto
              if(opcion.precio !== '') {
                opcion.precio = opcion.precio.replace(',', '.');
              }
            });
            return false; // Excluir este campo del array de `nuevoProducto`
          }
        }
        
        // Incluir el campo en `nuevoProducto.campos` si no tiene opciones o si tiene un ID
        return true;
      });

      console.log('Nuevo Producto:', nuevoProducto);
      console.log('Campos con Opciones:', camposConOpciones);
      console.log('data' , {
        ...nuevoProducto,
        camposConOpciones: camposConOpciones,
        duracion: this.camposTiempo
      });

      const dataTipoProducto = {
        ...nuevoProducto,
        camposConOpciones: camposConOpciones,
        duracion: this.camposTiempo
      };
      

      // EDITAR EL PRODUCTO:
      if(this.id_tipo_producto_editado) {
        
        camposConOpciones.forEach((campo) => {
          console.log(campo);
          if (campo.id != '' && campo.id != null) {
            // Si el campo tiene ID, se actualiza
            this.actualizarCampoConOpciones(campo, campo.id);
          } else {
            // Si el campo no tiene ID, se crea un nuevo registro
            this.crearCampoConOpciones(campo, this.id_tipo_producto_editado);
          }
        });

        this.camposService.editCamposPorTipoProducto(this.id_tipo_producto_editado, nuevoProducto.campos).subscribe((res) => {
          console.log(res);
        });

        this.familyService.editTipoProducto(this.id_tipo_producto_editado, this.nombreProducto).subscribe((tipo_producto) => {
          console.log(tipo_producto);
        });

        console.log(this.selectedFile);
        if(this.selectedFile) {
          this.productService.subirPlantilla(this.letrasIdentificacion, this.selectedFile).subscribe((res:any) => {
            console.log(res); 
          });
        }

        // Seleccionar de los campos los que son nuevos (no tienen id)
        const nuevosCampos = nuevoProducto.campos.filter((campo) => !campo.id);
        this.productService.addNuevosCampos(this.letrasIdentificacion, nuevosCampos).subscribe((res) => {
          console.log(res);
          this.cargandoNuevoProducto = false;
          this.snackBarService.openSnackBar('Tipo de producto editado con éxito');
        });

        // Recorrer los campos con opciones y guardarlos o editarlos dependiendo de si tienen ID
        

        

      // CREAR UN NUEVO PRODUCTO
      } else {

        this.productService.crearTipoProducto(dataTipoProducto).subscribe((res) => {

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
              this.snackBarService.openSnackBar('Tipo de producto creado con éxito');
              this.cargandoNuevoProducto = false;
              window.location.reload();
            });
          });
        },
        (error) => {
          console.log(error);
        });

      
    
      }
    }
  }

  // Método para actualizar un campo con opciones
  actualizarCampoConOpciones(campo: Campo, id_campo: string | null) {
    // Lógica para actualizar el campo en la base de datos
    this.camposService.actualizarCampoConOpciones(campo, id_campo).subscribe(response => {
      console.log('Campo actualizado:', response);
    }, error => {
      console.error('Error al actualizar el campo:', error);
    });
  }

  // Método para crear un nuevo campo con opciones
  crearCampoConOpciones(campo: Campo , id_tipo_producto: string | null) {
    // Lógica para crear un nuevo campo en la base de datos
    this.camposService.crearCampoConOpciones(campo, id_tipo_producto).subscribe(response => {
      console.log('Campo creado:', response);
    }, error => {
      console.error('Error al crear el campo:', error);
    });
  }





  // VERIFICAR FORMULARIO:
  verificarCampos(campos: any[], editando : boolean): boolean {

    let camposFormulario = [...campos, ...this.camposTiempo]; // Añadir los campos de tiempo al array de campos
    const campoFormatoFilasColumnasIncorrecto = this.formatoIncorrectoFilasColumnas(camposFormulario);
    const campoUsoCaracteresEspeciales = this.usoCaracteresEspeciales();
    const campoConOpcionesRepetidas = this.campoConOpcionesRepetidas(camposFormulario);
    const campoConOpcionPrecioFormatoIncorrecto = this.precioOpcionesFormatoIncorrecto(camposFormulario);
  
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
    
    if (campoConOpcionesRepetidas) {
      this.showErrorDialog('El campo selector ' + campoConOpcionesRepetidas.nombre + ' tiene opciones repetidas');
      return false;
    }
    
    if (campoConOpcionPrecioFormatoIncorrecto) {
      this.showErrorDialog('El precio de las opciones del campo selector ' + campoConOpcionPrecioFormatoIncorrecto.nombre + ' no tiene un formato correcto');
      return false;
    }
  
    return true;
  }
  

  private campoConOpcionesRepetidas(campos: Campo[]): Campo | null {
    for (const campo of campos) {
      const nombres = campo.opciones.map((opcion) => opcion.nombre);
      const nombresSet = new Set(nombres);
      
      // Si el tamaño del Set es menor que el array original, hay elementos duplicados
      if (nombresSet.size !== nombres.length) {
        return campo; // Retorna el campo con opciones repetidas
      }
    }
    
    return null; // Si no se encuentran campos con opciones repetidas, retorna null
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
      if (this.tiposProductos[i].letras_identificacion === AppConfig.PREFIJO_LETRAS_IDENTIFICACION + this.letrasIdentificacion) {
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
  

  private precioOpcionesFormatoIncorrecto(campos: Campo[]) : Campo | null {
    const formatoNumerico = /^\d+([.,]\d+)?$/;
    for(const campo of campos) {
      if(campo.tipo_dato === 'select') {
        for(const opcion of campo.opciones) {
          if(!formatoNumerico.test(opcion.precio)) {
            return campo;
          }
        }
      }
    }
    return null;
  }

  nombreCamposRepetidos() {
    const nombres = this.campos.map((campo) => campo.nombre);
    return nombres.some((nombre, index) => nombres.indexOf(nombre) !== index);
  }


  showErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      width: '300px',
      data: { message }
    });
  }
}


